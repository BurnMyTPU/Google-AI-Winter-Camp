import os
import csv
import json
import pickle
import numpy as np
from PIL import Image

import torch
from torch.utils import data

import torchvision
import torchvision.transforms as transforms
from pytorchcv.model_provider import get_model


base_size = 128
crop_size = 112
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
val_transform = transforms.Compose([
    transforms.Resize(base_size),
    transforms.CenterCrop(crop_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])


def load_net(load_pth):
    net = get_model('mobilenet_w1', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Sequential()

    state_dict = torch.load(load_pth)
    net.load_state_dict(state_dict, strict=False)
    net.eval()

    return net


def gen_feature():
    img_pth = '/home/lixiazhiguang/Data/validation/1'
    image = Image.open(img_pth).convert('RGB')
    image = val_transform(image).cuda()

    load_pth = '/home/lixiazhiguang/Projects/Fancy.1e-2.mobilenet/models/step_150000.pth'
    net = load_net(load_pth)
    feature = net(image)
    # 1 * 1024
    feature /= (feature.norm(dim=1, keepdim=True) + 1e-6)
    return feature


def main():
    features_pth = '/home/lixiazhiguang/Projects/Google-AI-Winter-Camp/search/npys/features.npy'
    attributes_pth = '/home/lixiazhiguang/Projects/Google-AI-Winter-Camp/search/npys/attributes.pkl'
    row2id_pth = '/home/lixiazhiguang/Projects/Google-AI-Winter-Camp/search/npys/row2id.pkl'
    with open(attributes_pth, 'rb') as fp:
        attributes = pickle.load(attributes_pth)
    with open(row2id_pth, 'rb') as fp:
        row2id = pickle.load(row2id_pth)
    features = np.load(features_pth).permute(1, 0)
    features = torch.Tensor(features).cuda()

    feature = gen_feature()
    similarities = feature.matmul(features)
    topk_idxs = torch.topk(similarities, 100, dim=1, largest=True)[1][0]

    selected_ids = [row2id[idx] for idx in topk_idxs]
    selected_attributes = [attributes_pth[id] for id in selected_ids]

    return selected_ids, selected_attributes

if __name__ == '__main__':
    pass
