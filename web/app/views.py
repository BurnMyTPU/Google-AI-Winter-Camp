from django.shortcuts import render

# Create your views here.
# coding:utf-8
from django.shortcuts import render, render_to_response, redirect
from django.http import *
from django.template import loader, context, RequestContext
import json
from django.http import JsonResponse
import os
from app.models import *
import json
import numpy as np


def query_items():
    '''
    0: accept items
    1: compute similarity
    2: sort scores
    3: return top N result in json format
    :return:
    '''
    pass


def query_imgs(request):
    '''
    0: accept imgs
    1: compute similarity
    2: sort scores
    3: return top N result in json format
    :return:
    '''
    if request.method == 'POST':
        base_dir = '/home/chaopengzhangpku/workspace/Google-AI-Winter-Camp/web/upload/'
        filename = request.FILES['image'].name
        # imagePath = '/home/ubuntu/flower/media/uploads/' + str(int(time.time() * 1000)) + "-" + filename
        imagePath = os.path.join(base_dir, filename)
        print('imagePath is ', imagePath)
        destination = open(imagePath, 'wb+')
        for chunk in request.FILES['image'].chunks():
            destination.write(chunk)
        destination.close()

        width = 50
        nb_classes = 6
        model_str = '/home/ubuntu/flower/app/model/model.json'
        model_weights = '/home/ubuntu/flower/app/model/weights_6.h5'
        global data, predicted_class
        # data, predicted_class = flower.model_predict(imagePath, model_str, model_weights, nb_classes, width)
        with open('./fashion.json') as data_file:
            data = json.load(data_file)
        # res = json.dumps(data)
        return HttpResponse(data)

    else:
        return HttpResponse("No Post!")


def get_recommended():
    pass
