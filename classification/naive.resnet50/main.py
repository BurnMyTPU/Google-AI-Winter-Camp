import os
import numpy as np

import torch
from torch import nn
from torch import optim
from torch.utils import data

import torchvision
import torchvision.transforms as transforms
from pytorchcv.model_provider import get_model
from tensorboardX import SummaryWriter

import dataset


def load_net_opt(load_pth='models/latest.pth', base_lr=1e-1):
    net = get_model('resnet50', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Linear(2048, 228)

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
    if step < 50000:
        lr = base_lr
    elif step < 80000:
        lr = base_lr * 0.1
    elif step < 100000:
        lr = base_lr * 0.01
    opt.param_groups[0]['lr'] = lr * 0.1
    opt.param_groups[1]['lr'] = lr


def statistics(output, target):
    output = (output > 0.5).float()
    inter = (output * target)
    precis = inter.sum(dim=1) / (output.sum(dim=1) + 1e-9)
    recall = inter.sum(dim=1) / (target.sum(dim=1) + 1e-9)
    F1 = 2 * precis * recall / (precis + recall + 1e-9)
    return precis.mean(), recall.mean(), F1.mean()


def main():
    base_lr = 1e-1
    net, opt = load_net_opt(base_lr=base_lr)
    crit = nn.BCEWithLogitsLoss().cuda()
    net = net.cuda()

    dt = dataset.FashionDataset('train', transform=dataset.train_transform)
    loader = data.DataLoader(dt, batch_size=32, shuffle=True, num_workers=8, pin_memory=True)
    dt_iter = iter(loader)

    writer = SummaryWriter('./tf_record')
    loss_meter = AverageMeter()
    prec_meter = AverageMeter()
    reca_meter = AverageMeter()
    avF1_meter = AverageMeter()

    for step in range(1, 100001):
        adjust_lr(step, base_lr, opt)

        try:
            image, label = next(dt_iter)
        except StopIteration:
            dt_iter = iter(loader)
            image, label = next(dt_iter)

        image = image.cuda()
        label = label.cuda()
        output = net(image)
        loss = crit(output, label)
        loss_meter.update(loss)

        opt.zero_grad()
        loss.backward()
        opt.step()

        prec, reca, avF1 = statistics(output, label)
        prec_meter.update(prec)
        reca_meter.update(reca)
        avF1_meter.update(avF1)

        if step % 200 == 0:
            print('Iter: %d, loss: %f, precision: %.4f, recall: %.4f, F1: %.4f' %
                    (step, loss_meter.avg, prec_meter.avg, reca_meter.avg, avF1_meter.avg))
            writer.add_scalar('loss', loss_meter.avg, step)
            writer.add_scalar('prec', prec_meter.avg, step)
            writer.add_scalar('reca', reca_meter.avg, step)
            writer.add_scalar('F1', avF1_meter.avg, step)

        if step % 500 == 0:
            torch.save(net.state_dict(), 'models/step_%d.pth' % step)
        if step % 2000 == 0:
            torch.save(net.state_dict(), 'models/latest.pth')


if __name__ == '__main__':
    main()
