import os
from collections import OrderedDict
import torch
import torch.nn as nn

from .. import layer as vn_layer
from .brick import shufflenetv2 as bsnv2

__all__ = ['shufflenetv2']

# default shufflenetv2 1x
class Shufflenetv2(nn.Module):
    def __init__(self, cfg):
        super().__init__()

        out_planes = cfg['out_channels']
        num_blocks = cfg['num_blocks']
        groups = cfg['groups']

        # Network
        layers_list = [
            # Sequence 0 : input = image tensor
            OrderedDict([
                ('stage3/convbatchrelu', vn_layer.Conv2dBatchReLU(3, 24, 3, 2)),
                ('stage3/max',           nn.MaxPool2d(3, 2, 1)),
                ]),

            OrderedDict([
                ('Stage4', bsnv2.Stage(24, out_planes[0], groups, num_blocks[0])),
                ]),

            OrderedDict([
                ('Stage5', bsnv2.Stage(out_planes[0], out_planes[1], groups, num_blocks[1])),
                ]),

            OrderedDict([
                ('Stage6', bsnv2.Stage(out_planes[1], out_planes[2], groups, num_blocks[2])),
                # the following is extra
                ]),
            ]

        self.layers = nn.ModuleList([nn.Sequential(layer_dict) for layer_dict in layers_list])

    def forward(self, x):
        stem = self.layers[0](x)
        stage4 = self.layers[1](stem)
        stage5 = self.layers[2](stage4)
        stage6 = self.layers[3](stage5)
        features = [stage6, stage5, stage4]
        return features


def shufflenetv2():
    cfg = {
        'out_channels': (116, 232, 464),
        'num_blocks': (3, 7, 3),
        'groups': 2
    }
    return Shufflenetv2(cfg)
