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
import torch
from app.FashionSearch import FashionSearch

fashionSearch = FashionSearch()


def index(request):
    return render_to_response("demo.html")


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
        image_path = os.path.join(base_dir, filename)
        print('imagePath is ', image_path)
        destination = open(image_path, 'wb+')
        for chunk in request.FILES['image'].chunks():
            destination.write(chunk)
        destination.close()
        # with open('/home/chaopengzhangpku/workspace/Google-AI-Winter-Camp/web/app/fashion.json') as data_file:
        #     data = json.load(data_file)
        selected_ids, selected_attributes = fashionSearch.get_prediction(image_path)
        ret = []
        for idx, imageid in enumerate(selected_ids):
            item = {}
            item['image_id'] = imageid
            item['imageUrl'] = '../static/images_set/{}'.format(imageid)
            item['attrs'] = selected_attributes[idx]
            ret.append(item)
        print(ret)
        # res = json.dumps(data)
        return HttpResponse(json.dumps(ret, ensure_ascii=False, indent=2))
    else:
        return HttpResponse("Post method is required!\n--Burn my tpu team")
