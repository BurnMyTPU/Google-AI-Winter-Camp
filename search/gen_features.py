import os
import pickle
import numpy as np

import torch
from torch import nn
from torch.nn import functional as F
from torch.utils import data

from pytorchcv.model_provider import get_model

import dataset


def load_net(load_pth='../../Fancy.1e-2.mobilenet/models/step_100000.pth'):
    net = get_model('mobilenet_w1', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Sequential()

    state_dict = torch.load(load_pth)
    net.load_state_dict(state_dict, strict=False)

    return net


def get_features(net):
    dt = dataset.FeatureDataset()
    loader = data.DataLoader(dt, batch_size=1000, shuffle=False, num_workers=16, pin_memory=True, drop_last=False)

    features = torch.Tensor(len(dt), 1024).cuda()
    image_list = []
    num = 0
    for image, image_ids in loader:
        print(num)
        image = image.cuda()
        with torch.no_grad():
            feature = net(image)
            feature /= (feature.norm(dim=1, keepdim=True) + 1e-6)
        batch_num = len(image)
        features[num:num+batch_num] = feature
        num += batch_num
        
        for image_id in image_ids:
            image_list.append(int(image_id))

    return features.cpu().numpy(), image_list


def gen_result():
    net = load_net()
    net = net.cuda()
    features, ids = get_features(net)
    np.save('./npys/features.npy', features)
    with open('./npys/row2id.pkl', 'wb') as fp:
        pickle.dump(ids, fp)


if __name__ == '__main__': 
    gen_result()
