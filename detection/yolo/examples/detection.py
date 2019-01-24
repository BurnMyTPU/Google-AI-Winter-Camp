import os
import argparse
import logging as log
import time
from statistics import mean
import numpy as np
import torch
from torchvision import transforms as tf
from pprint import pformat

import sys

sys.path.insert(0, '.')

import brambox.boxes as bbb
import vedanet as vn
from utils.envs import initEnv


class Detection:
    pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='OneDet: an one stage framework based on PyTorch')
    # parser.add_argument('model_name', help='model name', default='yolov3')
    # parser.add_argument('img', help='image path', default=None)
    # args = parser.parse_args()
    image_dir = '/home/chaopengzhangpku/workspace/dataset/fashion/validation'
    model_name = 'Yolov3'
    train_flag = 2  # Test
    config = initEnv(train_flag=train_flag, model_name=model_name)  # args.model_name)

    log.info('Config\n\n%s\n' % pformat(config))

    # init env
    hyper_params = vn.hyperparams.HyperParams(config, train_flag=train_flag)
    fw = open('./val_result.txt', 'w')
    imgs = os.listdir(image_dir)
    for img in imgs:
        img_path = os.path.join(image_dir, img)
        # # init and run eng
        ret = vn.engine.VOCTest_Single(hyper_params, img_path)
        fw.write(img + ' ' + str(ret) + '\n')
    fw.close()
