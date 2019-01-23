import os
import numpy as np

import torch
from torch import nn
from torch.nn import functional as F
from torch.utils import data

from pytorchcv.model_provider import get_model

import dataset


def load_net(load_pth=''):
    net = get_model('mobilenet_w1', pretrained=True)
    net.features.final_pool = nn.AdaptiveAvgPool2d(1)
    net.output = nn.Sequential()

    if os.path.isfile(load_pth):
        state_dict = torch.load(load_pth)
        net.load_state_dict(state_dict, strict=False)

    return net


def get_features(net, name):
    dt = dataset.FeatureDataset(name)
    loader = data.DataLoader(dt, batch_size=100, shuffle=False, num_workers=8, pin_memory=True, drop_last=False)

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

    return features, image_list


def gen_result():
    net = load_net()
    net = net.cuda()
    val_features, val_ids = get_features(net, 'validation')
    train_features, train_ids = get_features(net, 'train')

    train_features = train_features.permute(1, 0)
    Simi = val_features.matmul(train_features)
    topks = torch.topk(Simi, 1000, dim=1, largest=True)[1]

    key_query = {}
    for i, val_id in enumerate(val_ids):
        key_query[val_id] = [train_ids[j] for j in topks[i]]

    np.save('./key_query.npy', key_query)


def evaluate(k):
    map1 = np.load('../npys/key_query.npy')[()]
    map2 = np.load('./key_query.npy')[()]

    assert 1 <= k <= 1000, 'k must between [1, 1000]'
    assert len(set(map1.keys()) & map2.keys()) == \
             len(set(map1.keys()) | map2.keys()), 'length not equal'

    precisions = []
    recalls = []
    F1s = []
    for key in map1.keys():
        vals1 = set(map1[key])
        vals2 = set(map2[key][:k])
        inter = vals1 & vals2
        prec = len(inter) / len(vals2) if len(vals2) > 0 else 0
        reca = len(inter) / len(vals1) if len(vals1) > 0 else 0
        try:
            F1 = 2 * prec * reca / (prec + reca)
        except ZeroDivisionError:
            F1 = 0
        precisions.append(prec)
        recalls.append(reca)
        F1s.append(F1)

    precision = np.mean(np.array(precisions))
    recall = np.mean(np.array(recalls))
    F1 = np.mean(np.array(F1s))
    return precision, recall, F1


def draw_curve():
    from tensorboardX import SummaryWriter
    writer = SummaryWriter('./curve')
    for i in range(1, 1001):
        p, r, F = evaluate(i)
        writer.add_scalar('precision', p, i)
        writer.add_scalar('recall', r, i)
        writer.add_scalar('F', F, i)
        print(i, p, r, F)


if __name__ == '__main__': 
    gen_result()
    draw_curve()
