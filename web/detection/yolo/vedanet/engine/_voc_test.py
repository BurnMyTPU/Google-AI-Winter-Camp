import logging as log
import torch
from torchvision import transforms as tf
from statistics import mean
import os
from PIL import Image
from .. import data as vn_data
from .. import models
from . import engine
from utils.test import voc_wrapper

__all__ = ['VOCTest', 'VOCTest_Single']


class CustomDataset(vn_data.BramboxDataset):
    def __init__(self, hyper_params):
        anno = hyper_params.testfile
        root = hyper_params.data_root
        network_size = hyper_params.network_size
        labels = hyper_params.labels

        lb = vn_data.transform.Letterbox(network_size)
        it = tf.ToTensor()
        img_tf = vn_data.transform.Compose([lb, it])
        anno_tf = vn_data.transform.Compose([lb])

        def identify(img_id):
            return f'{img_id}'

        super(CustomDataset, self).__init__('anno_pickle', anno, network_size, labels, identify, img_tf, anno_tf)

    def __getitem__(self, index):
        img, anno = super(CustomDataset, self).__getitem__(index)
        for a in anno:
            a.ignore = a.difficult  # Mark difficult annotations as ignore for pr metric
        return img, anno


def VOCTest_Single(hyper_params, img_paths):
    log.debug('Creating network')

    model_name = hyper_params.model_name
    batch = hyper_params.batch
    use_cuda = hyper_params.cuda
    weights = hyper_params.weights
    conf_thresh = hyper_params.conf_thresh
    network_size = hyper_params.network_size
    labels = hyper_params.labels
    nworkers = hyper_params.nworkers
    pin_mem = hyper_params.pin_mem
    nms_thresh = hyper_params.nms_thresh
    # prefix = hyper_params.prefix
    results = hyper_params.results

    test_args = {'conf_thresh': conf_thresh, 'network_size': network_size, 'labels': labels}
    net = models.__dict__[model_name](hyper_params.classes, weights, train_flag=2, test_args=test_args)
    net.eval()
    # log.info('Net structure\n%s' % net)
    # import pdb
    # pdb.set_trace()
    if use_cuda:
        net.cuda()
    ret = []
    # loop here
    for img_path in img_paths:
        print('Reading Data')
        data = Image.open(img_path)

        lb = vn_data.transform.Letterbox(network_size)
        it = tf.ToTensor()
        img_tf = vn_data.transform.Compose([lb, it])
        data = img_tf(data)
        data = torch.unsqueeze(data, 0)
        print('Running network')
        if use_cuda:
            data = data.cuda()
        with torch.no_grad():
            output, loss = net(data, '')
        det = dict()
        det[img_path] = output[0]
        netw, neth = network_size
        reorg_dets = voc_wrapper.reorgDetection(det, netw, neth)
        res = voc_wrapper.genResults_Single(reorg_dets, results, nms_thresh)
        ret.append(str(res))
    return ret


def VOCTest(hyper_params):
    print('Creating network')
    # log.debug('Creating network')

    model_name = hyper_params.model_name
    batch = hyper_params.batch
    use_cuda = hyper_params.cuda
    weights = hyper_params.weights
    conf_thresh = hyper_params.conf_thresh
    network_size = hyper_params.network_size
    labels = hyper_params.labels
    nworkers = hyper_params.nworkers
    pin_mem = hyper_params.pin_mem
    nms_thresh = hyper_params.nms_thresh
    # prefix = hyper_params.prefix
    results = hyper_params.results

    test_args = {'conf_thresh': conf_thresh, 'network_size': network_size, 'labels': labels}
    net = models.__dict__[model_name](hyper_params.classes, weights, train_flag=2, test_args=test_args)
    net.eval()
    # log.info('Net structure\n%s' % net)
    # import pdb
    # pdb.set_trace()
    if use_cuda:
        net.cuda()

    print('Creating dataset')
    loader = torch.utils.data.DataLoader(
        CustomDataset(hyper_params),
        batch_size=batch,
        shuffle=False,
        drop_last=False,
        num_workers=nworkers if use_cuda else 0,
        pin_memory=pin_mem if use_cuda else False,
        collate_fn=vn_data.list_collate,
    )
    print('Running network')
    tot_loss = []
    coord_loss = []
    conf_loss = []
    cls_loss = []
    anno, det = {}, {}
    num_det = 0
    for idx, (data, box) in enumerate(loader):
        if (idx + 1) % 20 == 0:
            log.info('%d/%d' % (idx + 1, len(loader)))
        if use_cuda:
            data = data.cuda()
        with torch.no_grad():
            # output, loss = net(data, box)
            output, loss = net(data, '')
        key_val = len(det)
        anno.update({loader.dataset.keys[key_val + k]: v for k, v in enumerate(box)})
        det.update({loader.dataset.keys[key_val + k]: v for k, v in enumerate(output)})
    netw, neth = network_size
    reorg_dets = voc_wrapper.reorgDetection(det, netw, neth)
    voc_wrapper.genResults(reorg_dets, results, nms_thresh)
