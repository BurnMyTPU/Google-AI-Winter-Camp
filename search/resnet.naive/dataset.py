import os
import csv
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
    def __init__(self, part_name, root_dir='/home/lixiazhiguang/Data', transform=val_transform):
        super().__init__()
        self.transform = transform
        self.dir_path = '/home/lixiazhiguang/Data/%s' % part_name
        npy_pth = '../npys/%s_ids.npy' % part_name

        ids = np.load(npy_pth)
        self.ids = ids

    def __len__(self):
        return len(self.ids)

    def __getitem__(self, idx):
        image_id = self.ids[idx]

        image = Image.open(os.path.join(self.dir_path, str(image_id))).convert('RGB')
        if self.transform is not None:
            image = self.transform(image)

        return image, image_id


def test_dt():
    dt = FeatureDataset('validation', transform=val_transform)
    for i in range(1000):
        image, idx = dt[i]
        print(i, image.size(), idx)


if __name__ == '__main__':
    test_dt() 
