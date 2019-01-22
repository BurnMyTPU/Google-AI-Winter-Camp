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
from tensorboardX import SummaryWriter


def parse_csv():
    task_lbl_map = {i: [] for i in range(1, 10)}

    with open('/home/lixiazhiguang/Data/ids.csv') as fp:
        f_csv = csv.reader(fp)
        next(f_csv)
        for row in f_csv:
            lbl_id, task_id = row[:2]
            lbl_id, task_id = int(lbl_id), int(task_id)
            task_lbl_map[task_id].append(lbl_id)

    lbl2idx = dict.fromkeys(range(1, 228), 0)
    idx2lbl = [0] * 228
    start_idxs = [0] * 11

    idx = 0
    for task_id in sorted(task_lbl_map.keys()):
        lbl_ids = task_lbl_map[task_id]
        start_idxs[task_id] = idx
        for lbl_id in lbl_ids:
            idx2lbl[idx] = lbl_id
            lbl2idx[lbl_id] = idx
            idx += 1
    start_idxs[10] = idx

    return idx2lbl, lbl2idx, start_idxs

idx2lbl, lbl2idx, start_idxs = parse_csv()


class FashionDataset(data.Dataset):
    def __init__(self, part_name, root_dir='/home/lixiazhiguang/Data', transform=None):
        super().__init__()
        self.transform = transform
        self.dir_path = '%s/%s' % (root_dir, part_name)
        json_pth = '%s/%s.json' % (root_dir, part_name)

        with open(json_pth) as fp:
            json_obj = json.load(fp)
        annos = json_obj['annotations']

        miss_pth = '%s/missing-images.txt' % root_dir
        with open(miss_pth) as fp:
            misses = fp.readlines()
        misses = set([miss[:-1] for miss in misses])

        self.annos = [anno for anno in annos if anno['imageId'] not in misses]

    def __len__(self):
        return len(self.annos)

    def __getitem__(self, idx):
        anno = self.annos[idx]

        image_id = anno['imageId']
        image = Image.open(os.path.join(self.dir_path, image_id)).convert('RGB')
        if self.transform is not None:
            image = self.transform(image)

        idxs = [lbl2idx[int(id)] for id in anno['labelId']]
        label = np.zeros(228, dtype=np.float32)
        label[idxs] = 1
        label = torch.from_numpy(label)

        return image, label


base_size = 128
crop_size = 112
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
train_transform = transforms.Compose([
    transforms.Resize(base_size),
    transforms.RandomCrop(crop_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])
val_transform = transforms.Compose([
    transforms.Resize(base_size),
    transforms.CenterCrop(crop_size),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
])


def test_dt():
    dt = FashionDataset('validation', transform=train_transform)
    for i in range(1000):
        break
        image, label = dt[i]
        print(i, image.size(), label.size())


if __name__ == '__main__':
    test_dt() 
