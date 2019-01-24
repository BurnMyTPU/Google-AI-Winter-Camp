#!/usr/bin/env python
#
#   Copyright EAVISE
#   Example: Transform annotations for VOCdevkit to the brambox pickle format
#

# modified by mileistone

import os
import sys
import xml.etree.ElementTree as ET

sys.path.insert(0, '.')
import brambox.boxes as bbb

DEBUG = True  # Enable some debug prints with extra information
ROOT = '/home/chaopengzhangpku/workspace/dataset/i_Fashion_Devkit'  # Root folder where the VOCdevkit is located

TRAINSET = [
    ('2019', 'train'),
]

TESTSET = [
    ('2019', 'test'),
]


def identify(xml_file):
    root_dir = ROOT
    root = ET.parse(xml_file).getroot()
    folder = root.find('folder').text + '2019'
    filename = root.find('filename').text
    return f'{root_dir}/{folder}/JPEGImages/{filename}'


if __name__ == '__main__':
    # print('Getting training annotation filenames')
    # train = []
    # for (year, img_set) in TRAINSET:
    #     with open(f'{ROOT}/fashion{year}/train.txt', 'r') as f:
    #         ids = f.read().strip().split()
    #     train += [f'{ROOT}/fashion{year}/Annotations/{xml_id}.xml' for xml_id in ids]
    #
    # if DEBUG:
    #     print(f'\t{len(train)} xml files')
    #
    # print('Parsing training annotation files')
    # train_annos = bbb.parse('anno_pascalvoc', train, identify)
    # # Remove difficult for training
    # for k, annos in train_annos.items():
    #     for i in range(len(annos) - 1, -1, -1):
    #         if annos[i].difficult:
    #             del annos[i]
    #
    # print('Generating training annotation file')
    # bbb.generate('anno_pickle', train_annos, f'{ROOT}/onedet_cache/train.pkl')
    #
    # print()

    print('Getting testing annotation filenames')
    test = []
    for (year, img_set) in TESTSET:
        with open(f'{ROOT}/i_fashion{year}/test.txt', 'r') as f:
            ids = f.read().strip().split()
        test += [f'{ROOT}/i_fashion{year}/Annotations/{xml_id}.xml' for xml_id in ids]

    if DEBUG:
        print(f'\t{len(test)} xml files')

    print('Parsing testing annotation files')
    test_annos = bbb.parse('anno_pascalvoc', test, identify)

    print('Generating testing annotation file')
    bbb.generate('anno_pickle', test_annos, f'{ROOT}/onedet_cache/test.pkl')
