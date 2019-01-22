import matplotlib.pyplot as plt
import matplotlib.pylab as pylab

import requests
from io import BytesIO
from PIL import Image
import numpy as np
from maskrcnn_benchmark.config import cfg
from predictor import COCODemo
import cv2

config_file = "../configs/caffe2/e2e_mask_rcnn_R_50_FPN_1x_caffe2.yaml"
# update the config options with the config file
cfg.merge_from_file(config_file)
# manual override some options
cfg.merge_from_list(["MODEL.DEVICE", "cpu"])
coco_demo = COCODemo(
    cfg,
    min_image_size=800,
    confidence_threshold=0.7,
)


def load(url):
    """
    Given an url of an image, downloads the image and
    returns a PIL image
    """
    response = requests.get(url)
    pil_image = Image.open(BytesIO(response.content)).convert("RGB")
    # convert to BGR format
    image = np.array(pil_image)[:, :, [2, 1, 0]]
    return image


if __name__ == '__main__':
    import os

    image_dir = '/home/chaopengzhangpku/workspace/dataset/fashion/validation'
    save_dir = '/home/chaopengzhangpku/workspace/dataset/fashion/mask-rcnn/validation'
    imgs = os.listdir(image_dir)
    for img in imgs:
        im_path = os.path.join(image_dir, img)
        pil_image = Image.open(im_path).convert("RGB")
        # convert to BGR format
        image = np.array(pil_image)[:, :, [2, 1, 0]]
        predictions = coco_demo.run_on_opencv_image(image)
        dst_path = os.path.join(save_dir, img)
        cv2.imwrite(dst_path, predictions)
        print('Processed {}'.format(img))
