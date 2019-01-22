import os
import json
import math
import torch
import numpy as np


def gen_candidates(name, num):
    json_pth = '/home/lixiazhiguang/Data/%s.json' % name
    with open(json_pth) as fp:
        json_obj = json.load(fp)

    annos = json_obj['annotations']
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


def main():
    val_anno_map = gen_candidates('validation', 1000)
    train_anno_map = gen_candidates('train', 10000)

    val_ids = list(val_anno_map.keys())
    train_ids = list(train_anno_map.keys())

    val_num, train_num = len(val_ids), len(train_ids)
    matrix = np.zeros((val_num, train_num), dtype=np.int16)
    for i, val_id in enumerate(val_ids):
        str1 = val_anno_map[val_id]
        for j, train_id in enumerate(train_ids):
            str2 = train_anno_map[train_id]
            dist = str_distance(str1, str2)
            matrix[i][j] = dist
        if i % 10 == 0:
            print(i, train_id)

    key_query = {}
    tensor = torch.Tensor(matrix)
    topks = torch.topk(tensor, 100, dim=1, largest=False)[1]
    topks = topks.numpy()
    for i, val_id in enumerate(val_ids):
        key_query[val_id] = [train_ids[j] for j in topks[i]]

    np.save('val_ids.pkl', val_ids)
    np.save('train_ids.pkl', train_ids)
    np.save('key_query.pkl', key_query)


main()

