import os
import csv
import json
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

class FeatureDataset(data.Dataset):
    def __init__(self, transform=val_transform):
        super().__init__()
        self.transform = transform
        self.dir_path = '/home/lixiazhiguang/Data/train'

        json_pth = '/home/lixiazhiguang/Data/train.json'
        with open(json_pth) as fp:
            json_obj = json.load(fp)
        annos = json_obj['annotations']
        ids = [int(anno['imageId']) for anno in annos]

        root_dir = '/home/lixiazhiguang/Data'
        miss_pth = '%s/missing-images.txt' % root_dir
        with open(miss_pth) as fp:
            misses = fp.readlines()
        misses = set([int(miss[:-1]) for miss in misses])

        self.ids = [id for id in ids if id not in misses]

    def __len__(self):
        return len(self.ids)

    def __getitem__(self, idx):
        image_id = self.ids[idx]

        image = Image.open(os.path.join(self.dir_path, str(image_id))).convert('RGB')
        if self.transform is not None:
            image = self.transform(image)

        return image, image_id


def test_dt():
    dt = FeatureDataset()
    for i in range(1000):
        image, id = dt[i]
        print(i, image.size(), id)


if __name__ == '__main__':
    test_dt() 
