import os
import csv
import json
import pickle
import numpy as np
from PIL import Image
import torch.nn as nn
import torch
from torch.utils import data

import torchvision
import torchvision.transforms as transforms
from pytorchcv.model_provider import get_model


class FashionSearch:
    def __init__(self):
        self.base_dir = '/home/chaopengzhangpku/workspace/server_data'
        self.back_bone = 'mobilenet_w1'
        self.model = os.path.join(self.base_dir, 'step_150000.pth')
        self.net = self.load_net(self.back_bone, self.model)
        self.gallery_features_path = os.path.join(self.base_dir, 'features.npy')
        self.gallery_attributes_path = os.path.join(self.base_dir, 'attributes.pkl')
        self.gallery_row2id_path = os.path.join(self.base_dir, 'row2id.pkl')
        with open(self.gallery_attributes_path,'rb') as fp:
            self.attributes = pickle.load(self.gallery_attributes_path)
        with open(self.gallery_row2id_path,'rb') as fp:
            self.row2id = pickle.load(self.gallery_row2id_path)
        self.gallery_features = np.load(self.gallery_features_path).permute(1, 0)
        self.gallery_features = torch.Tensor(self.gallery_features).cuda()
        self.top_k = 20
        self.base_size = 128
        self.crop_size = 112
        self.mean = [0.485, 0.456, 0.406]
        self.std = [0.229, 0.224, 0.225]
        self.val_transform = transforms.Compose([
            transforms.Resize(self.base_size),
            transforms.CenterCrop(self.crop_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.mean, std=self.std)
        ])

    def load_net(self, back_bone, weight_path):
        net = get_model(back_bone, pretrained=True)
        net.features.final_pool = nn.AdaptiveAvgPool2d(1)
        net.output = nn.Sequential()
        state_dict = torch.load(weight_path)
        net.load_state_dict(state_dict, strict=False)
        net.eval()
        return net

    def get_feature(self, img_path):
        image = Image.open(img_path).convert('RGB')
        image = self.val_transform(image).cuda()
        with torch.no_grad():
            feature = self.net(image)
        # 1 * 1024
        feature /= (feature.norm(dim=1, keepdim=True) + 1e-6)
        return feature

    def get_prediction(self, img_path):
        feature = self.get_feature(img_path)
        similarities = feature.matmul(self.gallery_features)
        topk_idxs = torch.topk(similarities, self.top_k, dim=1, largest=True)[1][0]
        selected_ids = [self.row2id[idx] for idx in topk_idxs]
        selected_attributes = [self.attributes[id] for id in selected_ids]

        return selected_ids, selected_attributes


if __name__ == '__main__':
    fashion_search = FashionSearch()
    test_img = '/home/chaopengzhangpku/workspace/dataset/fashion/validation/7563'
    print(fashion_search.get_prediction(test_img))
