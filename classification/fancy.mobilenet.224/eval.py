import os
import numpy as np

import torch
from torch import nn
from torch.utils import data

import torchvision
import torchvision.transforms as transforms
from pytorchcv.model_provider import get_model
from tensorboardX import SummaryWriter

import dataset
from dataset import start_idxs


def load_net(load_pth='models/step_100000.pth'):
    net = get_model('mobilenet_w1', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Linear(1024, 228)

    if os.path.isfile(load_pth):
        state_dict = torch.load(load_pth)
        net.load_state_dict(state_dict)

    return net


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


def statistics(output, target):
    for task_id in [1, 2, 3, 4, 5, 6, 8, 9]:
        start_idx = start_idxs[task_id]
        end_idx = start_idxs[task_id+1]
        if task_id in [2, 4, 6]:
            output[:, start_idx:end_idx] = (output[:, start_idx:end_idx] > 0.001).float()
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
    net = load_net()
    net = net.cuda()
    net.eval()

    dt = dataset.FashionDataset('validation', transform=dataset.val_transform)
    loader = data.DataLoader(dt, batch_size=32, shuffle=False, num_workers=8, pin_memory=True, drop_last=False)

    prec_meter = AverageMeter()
    reca_meter = AverageMeter()
    avF1_meter = AverageMeter()

    for i, [image, label] in enumerate(loader):
        image = image.cuda()
        label = label.cuda()
        with torch.no_grad():
            output = net(image)

        prec, reca, avF1 = statistics(output, label)
        prec_meter.update(prec)
        reca_meter.update(reca)
        avF1_meter.update(avF1)

        if i % 20 == 0:
            print('Iter: %d, precision: %.4f, recall: %.4f, F1: %.4f' %
                    (i, prec_meter.avg, reca_meter.avg, avF1_meter.avg))
    print('precision: %.4f, recall: %.4f, F1: %.4f' %
            (prec_meter.avg, reca_meter.avg, avF1_meter.avg))


if __name__ == '__main__':
    main()
