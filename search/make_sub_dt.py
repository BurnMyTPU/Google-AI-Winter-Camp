import os
import json
import math
import numpy as np


def gen_candidates(name, num):
    json_pth = '/home/lixiazhiguang/Data/%s.json' % name
    with open(json_pth) as fp:
        json_obj = json.load(fp)
    annos = json_obj['annotations']

    root_dir = '/home/lixiazhiguang/Data'
    miss_pth = '%s/missing-images.txt' % root_dir
    with open(miss_pth) as fp:
        misses = fp.readlines()
    misses = set([miss[:-1] for miss in misses])

    annos = [anno for anno in annos if anno['imageId'] not in misses]
    annos = np.random.choice(annos, num)

    for anno in annos:
        anno['labelId'] = sorted([int(id) for id in anno['labelId']])
        anno['imageId'] = int(anno['imageId'])

    anno_map = {anno['imageId']: anno['labelId'] for anno in annos}

    return anno_map


def str_distance(str1, str2):
    len1 = len(str1) + 1
    len2 = len(str2) + 1
    matrix = [[0 for j in range(len2)] for i in range(len1)]
    for i in range(1, len1):
        for j in range(1, len2):
            uu = matrix[i-1][j] + 1
            ll = matrix[i][j-1] + 1
            ul = matrix[i-1][j-1]
            if str1[i-1] != str2[j-1]:
                ul += 1
            matrix[i][j] = min(uu, ll, ul)

    return matrix[len1-1][len2-1] + abs(len1 - len2)

def set_iou(set1, set2):
    inter = len(set1 & set2)
    union = len(set1 | set2)
    return inter / union


def main():
    val_anno_map = gen_candidates('validation', 1000)
    train_anno_map = gen_candidates('train', 100000)

    val_ids = list(val_anno_map.keys())
    train_ids = list(train_anno_map.keys())

    key_query = {}
    val_num, train_num = len(val_ids), len(train_ids)
    for i, val_id in enumerate(val_ids):
        set1 = set(val_anno_map[val_id])
        key_query[val_id] = []
        for train_id in train_ids:
            set2 = set(train_anno_map[train_id])
            iou = set_iou(set1, set2)
            if iou >= 0.5:
                key_query[val_id].append(train_id)

        if i % 100 == 0:
            print(i, val_id)

    np.save('./npys/validation_ids.npy', val_ids)
    np.save('./npys/train_ids.npy', train_ids)
    np.save('./npys/key_query.npy', key_query)


main()

