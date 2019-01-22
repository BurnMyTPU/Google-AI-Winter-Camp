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


def query_items():
    '''
    1: compute similarity
    2: sort scores
    3: return top N result in json format
    :return:
    '''
    pass


def query_imgs():
    pass


def get_recommended():
    pass
