import os
import numpy as np

import torch
from torch import nn
from torch import optim
from torch.nn import functional as F
from torch.utils import data

import torchvision
import torchvision.transforms as transforms
from pytorchcv.model_provider import get_model
from tensorboardX import SummaryWriter

import dataset
from dataset import start_idxs


def load_net_opt(load_pth='./models/step_60000.pth', base_lr=1e-1):
    net = get_model('mobilenet_w1', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Linear(1024, 228)

    if os.path.isfile(load_pth):
        state_dict = torch.load(load_pth)
        net.load_state_dict(state_dict)

    head_params = list(map(id, net.output.parameters()))
    base_params = filter(lambda p: id(p) not in head_params, net.parameters())

    opt = optim.SGD([
                {'params': base_params, 'lr': base_lr / 10},
                {'params': net.output.parameters(), 'lr': base_lr}
            ], lr=base_lr, momentum=0.9)

    return net, opt


class AverageMeter(object):
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count


def adjust_lr(step, base_lr, opt):
    if step < 100000:
        lr = base_lr
    elif step < 140000:
        lr = base_lr * 0.1
    elif step < 160000:
        lr = base_lr * 0.01
    opt.param_groups[0]['lr'] = lr * 0.1
    opt.param_groups[1]['lr'] = lr


def statistics(output, target):
    for task_id in [1, 2, 3, 4, 5, 6, 8, 9]:
        start_idx = start_idxs[task_id]
        end_idx = start_idxs[task_id+1]
        if task_id in [2, 4, 6]:
            output[:, start_idx:end_idx] = (output[:, start_idx:end_idx] > 0.5).float()
        else:
            max_idxs = output[:, start_idx:end_idx].max(dim=1)[1]
            output[:, start_idx:end_idx] = 0
            for i in range(len(max_idxs)):
                output[i, max_idxs[i]+start_idx] = 1
    inter = (output * target)
    precis = inter.sum(dim=1) / (output.sum(dim=1) + 1e-9)
    recall = inter.sum(dim=1) / (target.sum(dim=1) + 1e-9)
    F1 = 2 * precis * recall / (precis + recall + 1e-9)
    return precis.mean(), recall.mean(), F1.mean()


def main():
    base_lr = 1e-2
    net, opt = load_net_opt(base_lr=base_lr)
    net = net.cuda()

    dt = dataset.FashionDataset('train', transform=dataset.train_transform)
    loader = data.DataLoader(dt, batch_size=32, shuffle=True, num_workers=8, pin_memory=True)
    dt_iter = iter(loader)

    writer = SummaryWriter('./tf_record')
    loss_meters = {i: AverageMeter() for i in [1, 2, 3, 4, 5, 6, 8, 9]}
    loss_meter = AverageMeter()
    prec_meter = AverageMeter()
    reca_meter = AverageMeter()
    avF1_meter = AverageMeter()

    for step in range(1, 160001):
        adjust_lr(step, base_lr, opt)

        try:
            image, label = next(dt_iter)
        except StopIteration:
            dt_iter = iter(loader)
            image, label = next(dt_iter)

        image = image.cuda()
        label = label.cuda()
        output = net(image)

        eps = 1e-6
        losses = []
        for task_id in [1, 2, 3, 4, 5, 6, 8, 9]:
            start_idx = start_idxs[task_id]
            end_idx = start_idxs[task_id+1]
            if task_id in [2, 4, 6]:
                prob = torch.sigmoid(output[:, start_idx:end_idx])
                prob = torch.clamp(prob, eps, 1-eps)
                log_prob = -torch.log(prob)
                logprob_ = -torch.log(1 - prob)
                target = label[:, start_idx:end_idx]
                loss = (log_prob * target + logprob_ * (1 - target)).mean()
            else:
                prob = F.softmax(output[:, start_idx:end_idx], dim=1)
                prob = torch.clamp(prob, eps, 1-eps)
                log_prob = -torch.log(prob)
                target = label[:, start_idx:end_idx]
                loss = (log_prob * target).sum(dim=1).mean()
            losses.append(loss)
            loss_meters[task_id].update(loss)

        loss = sum(losses)# / 8
        loss_meter.update(loss)

        opt.zero_grad()
        loss.backward()
        opt.step()

        prec, reca, avF1 = statistics(output, label)
        prec_meter.update(prec)
        reca_meter.update(reca)
        avF1_meter.update(avF1)

        if step % 1000 == 0:
            print('Iter: %d, loss: %f, precision: %.4f, recall: %.4f, F1: %.4f' %
                    (step, loss_meter.avg, prec_meter.avg, reca_meter.avg, avF1_meter.avg))
            print(', '.join(['loss%d: %.4f' % (task_id, meter.avg) for task_id, meter in loss_meters.items()]))
            writer.add_scalar('loss', loss_meter.avg, step)
            writer.add_scalar('prec', prec_meter.avg, step)
            writer.add_scalar('reca', reca_meter.avg, step)
            writer.add_scalar('F1', avF1_meter.avg, step)
            for task_id, meter in loss_meters.items():
                writer.add_scalar('loss%d', meter.avg, step)

        if step % 2000 == 0:
            torch.save(net.state_dict(), 'models/latest.pth')
        if step % 10000 == 0:
            torch.save(net.state_dict(), 'models/step_%d.pth' % step)


if __name__ == '__main__':
    main()
