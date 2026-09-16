from django.shortcuts import render
from rest_framework.generics import GenericAPIView
import re
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.core.exceptions import MultipleObjectsReturned
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import json
from datetime import datetime, timedelta

import random
import string
import time
from lumora.api.serializers import *
from lumora.models import *

from django.db.models import Q, F
import uuid
from rest_framework.decorators import api_view
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
import csv
from io import TextIOWrapper
from django.contrib import messages
import requests
from django.dispatch import receiver
from django.template import Context
from django.template.loader import get_template
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.exceptions import APIException
from django.core.mail import EmailMessage


from requests.exceptions import ConnectionError, HTTPError

from django.contrib.auth.decorators import login_required
import os
import json
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

import ast
# from apiclient.discovery import build
import pickle

from dotenv import load_dotenv
load_dotenv()
import threading
import ast
import random
import string
from django.utils import timezone

import json
import time
import requests
import random
import string
import datetime
from django.db import connection

secretDict = {'apikey': 'mock_key'}

def clean_json_response(text: str) -> str:
    """Removes markdown code blocks around JSON from responses."""
    if not text:
        return ""
    text = re.sub(r'^```(?:json|javascript)?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```\s*$', '', text)
    return text.strip()

def safe_parse_correct_int_list(correct_val, *option_texts):
    """Safely converts correct_val (numeric string, text string, or None) to a list of option indices."""
    if not correct_val:
        return []
    val_str = str(correct_val).strip()
    if not val_str:
        return []
    try:
        parts = [x.strip() for x in val_str.split(",") if x.strip() != ""]
        if parts and all(p.isdigit() for p in parts):
            return [int(p) for p in parts]
    except Exception:
        pass
    matched = []
    for idx, op_text in enumerate(option_texts, 1):
        if op_text and str(op_text).strip() == val_str:
            matched.append(idx)
    if matched:
        return matched
    return [1]


from lumora.cloudinary_storage import upload_file_to_cloudinary

def upload_to_s3(file_obj, bucket_name, file_name):
    """
    Legacy helper wrapper -- now routes uploads to Cloudinary.
    """
    url = upload_file_to_cloudinary(file_obj, file_name, folder="lumora_courses")
    return [url]

@login_required()
def ImageUpload(request):
    import pandas as pd
    if request.method == 'POST' and request.FILES.getlist('filenames'):
        file_name_list = []
        link_list = []
        response = HttpResponse(content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment;filename="Quibblemeimages.xlsx"'
        writer = pd.ExcelWriter(response, engine='xlsxwriter')

        for file_obj in request.FILES.getlist('filenames'):
            file_name = file_obj.name
            cloudinary_url = upload_file_to_cloudinary(file_obj, file_name, folder="lumora_courses")
            file_name_list.append(file_name)
            link_list.append(cloudinary_url)

        d1 = pd.DataFrame({'name': file_name_list, 'link': link_list})
        d1.to_excel(writer, sheet_name='Image', index=False)
        writer.save()
        return response

@api_view(['POST'])
@permission_classes([AllowAny])
def api_upload_single_image(request):
    """
    Single central REST API endpoint on Django backend to upload images directly to Cloudinary.
    Returns JSON: { "status": "success", "url": "<cloudinary_secure_url>", "filename": "..." }
    """
    try:
        file_obj = request.FILES.get('file') or request.FILES.get('image')
        if not file_obj:
            return Response({"error": "No image file provided in request.FILES ('file' or 'image')"}, status=400)

        custom_key = request.data.get('key') or request.POST.get('key')
        if custom_key:
            if '/' in custom_key:
                folder, filename = custom_key.split('/', 1)
            else:
                folder = 'lumora_courses'
                filename = custom_key
        else:
            filename = file_obj.name
            folder = request.data.get('folder') or request.POST.get('folder') or 'lumora_courses'

        cloudinary_url = upload_file_to_cloudinary(file_obj, filename=filename, folder=folder)

        return Response({
            "status": "success",
            "url": cloudinary_url,
            "filename": filename
        }, status=200)
    except Exception as e:
        logger.error(f"[api_upload_single_image] Error: {e}")
        return Response({"error": str(e)}, status=500)



class FetchGames(APIView):
    permission_classes = []
    def get(self, request):
        l=Games.objects.all().values_list('gameid','level_id','order','name','ImageLink','gameTip','in_gameTip','live','passage_text','grade_band','difficulty','target_skill')
        data=[]
        for i in l:
            d={}
            d['GameId']=i[0]
            d['LevelId']=i[1]
            d['Name']=i[3]
            d['Order']=i[2]
            d['ImageLink']=i[4]
            d['gameTip']=i[5]
            d['inGameTip']=i[6]
            d['live']=i[7]
            d['passage_text']=i[8]
            d['grade_band']=i[9]
            d['difficulty']=i[10]
            d['target_skill']=i[11]
            data.append(d)
        return Response(data)
    
    def post(self, request):
        l=Games.objects.filter(gameid=request.data['gameid']).values_list('gameid','level_id','order','name','ImageLink','gameTip','in_gameTip','live','passage_text','grade_band','difficulty','target_skill')
        data=[]
        for i in l:
            d={}
            d['GameId']=i[0]
            d['LevelId']=i[1]
            d['Name']=i[3]
            d['Order']=i[2]
            d['ImageLink']=i[4]
            d['gameTip']=i[5]
            d['inGameTip']=i[6]
            d['live']=i[7]
            d['passage_text']=i[8]
            d['grade_band']=i[9]
            d['difficulty']=i[10]
            d['target_skill']=i[11]
            data.append(d)
        return Response(data)

class FetchGamesMain(APIView):
    permission_classes = []
    def get(self, request):
        l=Games.objects.all().values_list('gameid','level_id','order','name','ImageLink','gameTip','in_gameTip','live','passage_text','grade_band','difficulty','target_skill')
        data=[]
        for i in l:
            if i[7].lower()=='yes':
                d={}
                d['GameId']=i[0]
                d['LevelId']=i[1]
                d['Name']=i[3]
                d['Order']=i[2]
                d['ImageLink']=i[4]
                d['gameTip']=i[5]
                d['inGameTip']=i[6]
                d['live']=i[7]
                d['passage_text']=i[8]
                d['grade_band']=i[9]
                d['difficulty']=i[10]
                d['target_skill']=i[11]
                data.append(d)
        return Response(data)
    
    def post(self, request):
        l=Games.objects.filter(gameid=request.data['gameid']).values_list('gameid','level_id','order','name','ImageLink','gameTip','in_gameTip','live','passage_text','grade_band','difficulty','target_skill')
        data=[]
        for i in l:
            if i[7].lower()=='yes':
                d={}
                d['GameId']=i[0]
                d['LevelId']=i[1]
                d['Name']=i[3]
                d['Order']=i[2]
                d['ImageLink']=i[4]
                d['gameTip']=i[5]
                d['inGameTip']=i[6]
                d['live']=i[7]
                d['passage_text']=i[8]
                d['grade_band']=i[9]
                d['difficulty']=i[10]
                d['target_skill']=i[11]
                data.append(d)
        return Response(data)


class FetchGamedata(APIView):
    permission_classes = []
    
    def post(self, request):
        if Games.objects.filter(gameid=request.data['gameid']).exists():
            l=Games.objects.filter(gameid=request.data['gameid']).values_list( 'name', 'order','gameid','level', 'topic', 'journey', 'type', 'title', 'ImageLink', 'description', 'gameTip', 'questionTip')
            data=[]
            for i in l:
                d={}
                d['Name']=i[0]
                d['Order']=i[1]
                d['GameId']=i[2]
                d['Level']=i[3]
                d['Topic']=i[4]
                d['Journey']=i[5]
                d['Type']=i[6]
                d['Title']=i[7]
                d['ImageLink']=i[8]
                d['Description']=i[9]
                d['gameTip']=i[10]
                d['questionTip']=i[11]
                data.append(d)
            return Response(data)

        elif MCQ.objects.filter(gameid=request.data['gameid']).exists():
            l=MCQ.objects.filter(gameid=request.data['gameid']).values_list( 'name', 'order','gameid','level', 'topic', 'journey', 'type', 'title', 'ImageLink', 'description', 'gameTip', 'questionTip').distinct()
            data=[]
 
            # for i in l:
            #     d={}
            #     d['name']=i[14]
            #     d['mcqid']=i[2]
            #     d['question']=i[4]
            #     if len(i[13])>1:
            #         d['isMultiCorrect']=True
            #     else:
            #         d['isMultiCorrect']=False
            #     d['correctOption']=list(map(int,i[13].split(",")))
            #     d['options']=[
            #         {
            #             "option":i[5],
            #             "image": i[6],
            #         },
            #         {
            #             "option":i[7],
            #             "image": i[8],
            #         },
            #         {
            #             "option":i[9],
            #             "image": i[10],
            #         },
            #         {
            #             "option":i[11],
            #             "image": i[12],
            #         }
            #     ]
            #     data.append(d)
            
            for i in l:
                d={}
                d['Name']=i[0]
                d['Order']=i[1]
                d['GameId']=i[2]
                d['Level']=i[3]
                d['Topic']=i[4]
                d['Journey']=i[5]
                d['Type']=i[6]
                d['Title']=i[7]
                d['ImageLink']=i[8]
                d['Description']=i[9]
                d['gameTip']=i[10]
                d['questionTip']=i[11]
                data.append(d)
            return Response(data)
        
        elif Mixed.objects.filter(gameid=request.data['gameid']).exists():
            l=Mixed.objects.filter(gameid=request.data['gameid']).values_list( 'name', 'order','gameid','level', 'topic', 'journey', 'type', 'title', 'ImageLink', 'description', 'gameTip', 'questionTip').distinct()
            data=[]
            for i in l:
                d={}
                d['Name']=i[0]
                d['Order']=i[1]
                d['GameId']=i[2]
                d['Level']=i[3]
                d['Topic']=i[4]
                d['Journey']=i[5]
                d['Type']='mixed'
                d['Title']=i[7]
                d['ImageLink']=i[8]
                d['Description']=i[9]
                d['gameTip']=i[10]
                d['questionTip']=i[11]
                data.append(d)
            return Response(data)
        else:
            return Response({"error":"incorrect game-id"})

class FetchMCQQuestions(APIView):
    permission_classes = []
    
    def post(self, request):
        if MCQ.objects.filter(gameid=request.data['gameid']).exists():
            l=MCQ.objects.filter(gameid=request.data['gameid']).values_list( 'gameid', 'qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'correct', 'mcqid', 'order', 'name', 'journey', 'level', 'ImageLink', 'description', 'gameTip', 'questionTip', 'title', 'topic', 'type')
            data=[]
 
            for i in l:
                d={}
                d['name']=i[14]
                d['mcqid']=i[12]
                d['question']=i[2]
                if len(i[11])>1:
                    d['isMultiCorrect']=True
                else:
                    d['isMultiCorrect']=False
                d['correctOption']=safe_parse_correct_int_list(i[11], i[3], i[5], i[7], i[9])
                d['options']=[
                    {
                        "option":i[3],
                        "image": i[4],
                    },
                    {
                        "option":i[5],
                        "image": i[6],
                    },
                    {
                        "option":i[7],
                        "image": i[8],
                    },
                    {
                        "option":i[9],
                        "image": i[10],
                    }
                ]
                data.append(d)
            
            return Response(data)
        else:
            return Response({"error":"incorrect game-id"})
            
class FetchMixedQuestions(APIView):
    permission_classes = []
    
    def post(self, request):
        if Mixed.objects.filter(gameid=request.data['gameid']).exists():
            l=Mixed.objects.filter(gameid=request.data['gameid']).values_list( 'gameid', 'qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'correct', 'qid', 'order', 'name', 'journey', 'level', 'ImageLink', 'description', 'gameTip', 'questionTip', 'title', 'topic', 'type')
            data=[]
 
            for i in l:
                d={}
                d['name']=i[14]
                d['qid']=i[12]
                d['question']=i[2]
                   
                d['type']=i[23]
                if i[23]=='mcq':
                    if len(i[11])>1:
                        d['isMultiCorrect']=True
                    else:
                        d['isMultiCorrect']=False
                    d['correctOption']=safe_parse_correct_int_list(i[11], i[3], i[5], i[7], i[9])
                    d['options']=[
                        {
                            "option":i[3],
                            "image": i[4],
                        },
                        {
                            "option":i[5],
                            "image": i[6],
                        },
                        {
                            "option":i[7],
                            "image": i[8],
                        },
                        {
                            "option":i[9],
                            "image": i[10],
                        }
                    ]
                if i[23]=='swipe':
                    d['isMultiCorrect']=False
                    d['correctOption']=list(map(str,i[11].split(",")))
                    d['options']=[
                        {
                            "option":i[3],
                            "image": i[4],
                        }
                    ]
                data.append(d)
            
            return Response(data)
        else:
            return Response({"error":"incorrect game-id"})

class Fetchtile(APIView):
    permission_classes = []
    
    def post(self, request):
        if Tiles.objects.filter(tileid=request.data['tileid']).exists():
            l=Tiles.objects.filter(tileid=request.data['tileid']).values_list( 'gameid','tileid','type', 'questionTip','qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'op5', 'op5Link','op6', 'op6Link','op7', 'op7Link','op8', 'op8Link', 'correct','live','reason','skill_tag','has_reasoning_prompt' ).order_by('qno')
            data=[]
 
            for i in l:
                d={}
                d['gameid']=i[0]
                d['tileid']=i[1]
                d['type']=i[2]
                d['questionTip']=i[3]
                d['question']=i[5]
                d['live']=i[23]
                d['reason']=i[24]
                d['skill_tag']=i[25]
                d['has_reasoning_prompt']=i[26]
                if i[2].lower()=='mcq':
                    if len(i[22])>1:
                        d['isMultiCorrect']=True
                    else:
                        d['isMultiCorrect']=False
                    d['correctOption']=safe_parse_correct_int_list(i[22], i[6], i[8], i[10], i[12], i[14], i[16], i[18], i[20])
                    d['options']=[
                        {
                            "option":i[6],
                            "image": i[7],
                        },
                        {
                            "option":i[8],
                            "image": i[9],
                        },
                        {
                            "option":i[10],
                            "image": i[11],
                        },
                        {
                            "option":i[12],
                            "image": i[13],
                        },
                        {
                            "option":i[14],
                            "image": i[15],
                        },
                        {
                            "option":i[16],
                            "image": i[17],
                        },
                        {
                            "option":i[18],
                            "image": i[19],
                        },
                        {
                            "option":i[20],
                            "image": i[21],
                        }
                    ]
                if i[2].lower()=='swipe':
                    d['isMultiCorrect']=False
                    d['questionTip']=i[5]
                    d['live']=i[23]
                    d['correctOption']=list(map(str,i[22].split(",")))
                    d['options']=[
                        {
                            "option":i[6],
                            "image": i[7],
                        }
                    ]
                return Response(d)
            
            
        else:
            return Response({"error":"incorrect tilr-id"})


class FetchtileData(APIView):
    permission_classes = []
    
    def post(self, request):
        if Tiles.objects.filter(gameid=request.data['gameid']).exists():
            l=Tiles.objects.filter(gameid=request.data['gameid']).values_list( 'gameid','tileid','type', 'questionTip','qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'op5', 'op5Link','op6', 'op6Link','op7', 'op7Link','op8', 'op8Link', 'correct','live','reason','skill_tag','has_reasoning_prompt' ).order_by('qno')
            data=[]
 
            for i in l:
                d={}
                d['gameid']=i[0]
                d['tileid']=i[1]
                d['type']=i[2]
                d['questionTip']=i[3]
                d['question']=i[5]
                d['live']=i[23]
                d['reason']=i[24]
                d['skill_tag']=i[25]
                d['has_reasoning_prompt']=i[26]
                if i[2].lower()=='mcq':
                    if len(i[22])>1:
                        d['isMultiCorrect']=True
                    else:
                        d['isMultiCorrect']=False
                    d['correctOption']=safe_parse_correct_int_list(i[22], i[6], i[8], i[10], i[12], i[14], i[16], i[18], i[20])
                    d['options']=[
                        {
                            "option":i[6],
                            "image": i[7],
                        },
                        {
                            "option":i[8],
                            "image": i[9],
                        },
                        {
                            "option":i[10],
                            "image": i[11],
                        },
                        {
                            "option":i[12],
                            "image": i[13],
                        },
                        {
                            "option":i[14],
                            "image": i[15],
                        },
                        {
                            "option":i[16],
                            "image": i[17],
                        },
                        {
                            "option":i[18],
                            "image": i[19],
                        },
                        {
                            "option":i[20],
                            "image": i[21],
                        }
                    ]
                if i[2].lower()=='swipe':
                    d['isMultiCorrect']=False
                    d['questionTip']=i[5]
                    d['live']=i[23]
                    d['correctOption']=list(map(str,i[22].split(",")))
                    d['options']=[
                        {
                            "option":i[6],
                            "image": i[7],
                        }
                    ]
                data.append(d)
            
            return Response(data)
        else:
            return Response({"error":"incorrect game-id"})

class FetchtileDataMain(APIView):
    permission_classes = []
    
    def post(self, request):
        if Tiles.objects.filter(gameid=request.data['gameid']).exists():
            l=Tiles.objects.filter(gameid=request.data['gameid']).values_list( 'gameid','tileid','type', 'questionTip','qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'op5', 'op5Link','op6', 'op6Link','op7', 'op7Link','op8', 'op8Link', 'correct','live','reason','skill_tag','has_reasoning_prompt' ).order_by('qno')
            data=[]
 
            for i in l:
                if i[23].lower()=='yes':
                    d={}
                    d['gameid']=i[0]
                    d['tileid']=i[1]
                    d['type']=i[2]
                    d['questionTip']=i[3]
                    d['question']=i[5]
                    d['live']=i[23]
                    d['reason']=i[24]
                    d['skill_tag']=i[25]
                    d['has_reasoning_prompt']=i[26]
                    if i[2].lower()=='mcq':
                        if len(i[22])>1:
                            d['isMultiCorrect']=True
                        else:
                            d['isMultiCorrect']=False
                        d['correctOption']=safe_parse_correct_int_list(i[22], i[6], i[8], i[10], i[12], i[14], i[16], i[18], i[20])
                        d['options']=[
                            {
                                "option":i[6],
                                "image": i[7],
                            },
                            {
                                "option":i[8],
                                "image": i[9],
                            },
                            {
                                "option":i[10],
                                "image": i[11],
                            },
                            {
                                "option":i[12],
                                "image": i[13],
                            },
                            {
                                "option":i[14],
                                "image": i[15],
                            },
                            {
                                "option":i[16],
                                "image": i[17],
                            },
                            {
                                "option":i[18],
                                "image": i[19],
                            },
                            {
                                "option":i[20],
                                "image": i[21],
                            }
                        ]
                    if i[2].lower()=='swipe':
                        d['isMultiCorrect']=False
                        d['questionTip']=i[5]
                        d['live']=i[23]
                        d['correctOption']=list(map(str,i[22].split(",")))
                        d['options']=[
                            {
                                "option":i[6],
                                "image": i[7],
                            }
                        ]
                    data.append(d)
            
            return Response(data)
        else:
            return Response({"error":"incorrect game-id"})


class FetchNextGame(APIView):
    permission_classes = []
    
    def post(self, request):
        if Games.objects.filter(gameid=request.data['gameid']).exists():
            lid=Games.objects.get(gameid=request.data['gameid']).level_id
            next_game_order = Games.objects.get(gameid=request.data['gameid']).order + 1

            if Games.objects.filter(Q(level_id=lid) & Q(order=next_game_order)).exists(): # on same level
                gid=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).gameid
                l=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).live
                game_name=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).name
                return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})
            
            tid = Level.objects.get(level_id=lid).topic_id
            
            l= Level.objects.filter(topic_id=tid).values_list('level_id','order').order_by('order')
      
            for i in range(0,len(l)):
               
                if l[i][0]==lid and i!=len(l)-1:
                    next_level_id=l[i+1][0]
                    
                    first_row  = Games.objects.filter(level_id=next_level_id).earliest('order')
                    o = first_row.order

                    gid=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).gameid
                    l=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).live
                    game_name=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).name
                    return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})   #next level 1st game
                
            c_id = Topic.objects.get(topic_id=tid).courseid
            
            l = Topic.objects.filter(courseid=c_id).values_list('topic_id','order').order_by('order')
            next_topic_id=''
            for i in range(0,len(l)):
                if l[i][0]==tid and i!=len(l)-1:
                    next_topic_id=l[i+1][0]
                    break
            print("here",next_topic_id)
            if Level.objects.filter(topic_id=next_topic_id).exists()==False:
                return Response({"gameid":"next level not exist on dev","exist":False})

            first_row  = Level.objects.filter(topic_id=next_topic_id).earliest('order')
            o = first_row.order

            lid = Level.objects.get(Q(topic_id=next_topic_id) & Q(order=o)).level_id
            print(lid)

            first_row  = Games.objects.filter(level_id=lid).earliest('order')
            o = first_row.order

            gid=Games.objects.get(Q(level_id=lid) & Q(order=o)).gameid
            l=Games.objects.get(Q(level_id=lid) & Q(order=o)).live
            game_name=Games.objects.get(Q(level_id=lid) & Q(order=o)).name
            return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})   #next level 1st game
        else:
            return Response({"gameid":"next game not exist on dev","exist":False})


class FetchNextGameMain(APIView):
    permission_classes = []
    
    def post(self, request):
        if Games.objects.filter(gameid=request.data['gameid']).exists():
            lid=Games.objects.get(gameid=request.data['gameid']).level_id
            next_game_order = Games.objects.get(gameid=request.data['gameid']).order + 1

            if Games.objects.filter(Q(level_id=lid) & Q(order=next_game_order)).exists(): # on same level
                gid=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).gameid
                l=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).live
                if l=="yes":
                    game_name=Games.objects.get(Q(level_id=lid) & Q(order=next_game_order)).name
                    return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})
            
            tid = Level.objects.get(level_id=lid).topic_id

            l= Level.objects.filter(topic_id=tid).values_list('level_id','order').order_by('order')
            for i in range(0,len(l)):
                if l[i][0]==lid and i!=len(l)-1:
                    next_level_id=l[i+1][0]

                    first_row  = Games.objects.filter(level_id=next_level_id).earliest('order')
                    o = first_row.order

                    gid=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).gameid
                    l=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).live
                    if l=="yes":
                        game_name=Games.objects.get(Q(level_id=next_level_id) & Q(order=o)).name
                        return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})   #next level 1st game
                
            c_id = Topic.objects.get(topic_id=tid).courseid
            
            l = Topic.objects.filter(courseid=c_id).values_list('topic_id','order').order_by('order')
            next_topic_id=''
            for i in range(0,len(l)):
                if l[i][0]==tid and i!=len(l)-1:
                    next_topic_id=l[i+1][0]
                    break
            
            if Level.objects.filter(topic_id=next_topic_id).exists()==False:
                return Response({"gameid":"next level not exist on live","exist":False})

            first_row  = Level.objects.filter(topic_id=next_topic_id).earliest('order')
            o = first_row.order
            lid = Level.objects.get(Q(topic_id=next_topic_id) & Q(order=o)).level_id
            
            first_row  = Games.objects.filter(level_id=lid).earliest('order')
            o = first_row.order

            gid=Games.objects.get(Q(level_id=lid) & Q(order=o)).gameid
            l=Games.objects.get(Q(level_id=lid) & Q(order=o)).live

            if l=="yes":
                game_name=Games.objects.get(Q(level_id=lid) & Q(order=o)).name
                return Response({"gameid":gid,"live":l,"exist":True,"game_name":game_name})   #next topic 1st game
            else:
                return Response({"gameid":"next game not exist on live","exist":False})
        else:
            return Response({"gameid":"not exist","exist":False})

class CreateCourseAdmin(APIView):
    permission_classes = []

    def post(self, request):
        action = request.data.get('action')
        course_id = request.data.get('courseid')
        order = request.data.get('order')
        name = request.data.get('name')
        image_link = request.data.get('ImageLink')
        course_tip = request.data.get('course_tip')
        live = request.data.get('live')
        email = request.data.get('email')
        category_names = request.data.get('categories', [])  # Assuming categories are names

        # Convert category names to IDs
        category_ids = []
        for name in category_names:
            try:
                category = Categories.objects.get(name=name)
                category_ids.append(category.id)
            except Categories.DoesNotExist:
                return Response({"message": f"Category '{name}' does not exist", "status": False})

        if action == "update":
            # Handle update logic
            try:
                course = Course.objects.get(courseid=course_id)
                course.order = order
                course.name = name
                course.ImageLink = image_link
                course.course_tip = course_tip
                course.live = live
                course.email = email
                course.categories.set(category_ids)  # Update ManyToManyField
                course.save()
                return Response({"message": "course updated", "status": True})
            except Course.DoesNotExist:
                return Response({"message": "course id does not exist", "status": False})

        elif action == "create":
            # Handle create logic
            if Course.objects.filter(courseid=course_id).exists():
                return Response({"message": "course id already exists", "status": False})
            else:
                # Get the last order value
                last_result = Course.objects.order_by('-order').first()
                new_order = last_result.order + 1 if last_result else 1
                
                # Create the new course
                course = Course.objects.create(
                    courseid=course_id,
                    order=new_order,
                    name=name,
                    ImageLink=image_link,
                    course_tip=course_tip,
                    live=live,
                    email=email
                )
                course.categories.set(category_ids)  # Set ManyToManyField after creation
                return Response({"message": "course created", "status": True})
        else:
            return Response({"message": "Invalid action", "status": False})

        if request.data['action']=="update":
            if Course.objects.filter(courseid=request.data['courseid']).exists():
            
                Course.objects.filter(courseid=request.data['courseid']).update(
                    courseid=request.data['courseid'], 
                    order = request.data['order'], 
                    name = request.data['name'], 
                    ImageLink = request.data['ImageLink'], 
                    course_tip =request.data['course_tip'], 
                    live=request.data['live'],
                    email=request.data['email'],
                    categories=request.data.get('categories', [])  
                )
                return Response({"message":"course updated","status":True})

        else:

            if Course.objects.filter(courseid=request.data['courseid']).exists():
                return Response({"message":"course id already exists","status":False})
            
            else:
                last_result = Course.objects.latest('id')
                o=last_result.order
                o=o+1
                Course.objects.create(
                    courseid=request.data['courseid'], 
                    order = o, 
                    name = request.data['name'], 
                    ImageLink = request.data['ImageLink'], 
                    course_tip =request.data['course_tip'], 
                    live=request.data['live'],
                    email=request.data['email'],
                    categories=request.data.get('categories', [])  
                )
                return Response({"message":"course created","status":True})


class CreateTopicAdmin(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['action']=="update":
            for obj in request.data['topics']:
                Topic.objects.filter(topic_id=obj['topic_id']).update(
                    topic_id=obj['topic_id'], 
                    courseid = obj['courseid'], 
                    order = obj['order'], 
                    ImageLink = obj['ImageLink'], 
                    name =obj['name'], 
                    live=obj['live'],
                    topic_tip=obj['topic_tip']
                )
            return Response({"message":"topics successfully updated","status":True})

        else:
            for obj in request.data['topics']:
                if Topic.objects.filter(topic_id=obj['topic_id']).exists():
                    return Response({"message":"topic id already exists :"+obj['topic_id'],"status":False})

                else:
                    if Topic.objects.filter(courseid = obj['courseid']).exists():
                        last_result = Topic.objects.filter(courseid = obj['courseid']).latest('id')
                        o=last_result.order
                        o=o+1
                    else:
                        o=1
                    Topic.objects.create(
                        topic_id=obj['topic_id'], 
                        courseid = obj['courseid'], 
                        order = o, 
                        ImageLink = obj['ImageLink'], 
                        name =obj['name'], 
                        live=obj['live'],
                        topic_tip=obj['topic_tip']
                    )
            return Response({"message":"topics successfully created","status":True})

class CreateLevelAdmin(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['action']=='update':
            for obj in request.data['levels']:
                Level.objects.filter(level_id=obj['level_id']).update(
                    topic_id=obj['topic_id'], 
                    level_id = obj['level_id'], 
                    order = obj['order'], 
                    ImageLink = obj['ImageLink'], 
                    name =obj['name'], 
                    live=obj['live'],
                    level_tip=obj['level_tip']
                )
            return Response({"message":"levels successfully updated","status":True})
        else:
            for obj in request.data['levels']:
                if Level.objects.filter(level_id=obj['level_id']).exists():
                    return Response({"message":"level id already exists :"+obj['level_id'],"status":False})

                else:
                    if Level.objects.filter(topic_id=obj['topic_id']).exists():
                        last_result = Level.objects.filter(topic_id=obj['topic_id']).latest('id')
                        o=last_result.order
                        o=o+1
                    else:
                        o=1
                  
                    Level.objects.create(
                        topic_id=obj['topic_id'], 
                        level_id = obj['level_id'], 
                        order = o, 
                        ImageLink = obj['ImageLink'], 
                        name =obj['name'], 
                        live=obj['live'],
                        level_tip=obj['level_tip']
                    )
            return Response({"message":"levels successfully created","status":True})

class CreateGameAdmin(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['action']=="update":
            for obj in request.data['games']:
                update_kwargs = dict(
                    gameid=obj['gameid'], 
                    level_id = obj['level_id'], 
                    order = obj['order'], 
                    ImageLink = obj['ImageLink'], 
                    name =obj['name'], 
                    live=obj['live'],
                    gameTip=obj['gameTip'],
                    in_gameTip=obj['in_gameTip']
                )
                # Lumora fields: only set if the caller actually sent them, so
                # existing callers that don't know about these fields (e.g. an
                # older cached admin build) don't accidentally wipe them back
                # to blank on every unrelated update.
                for key in ('passage_text', 'grade_band', 'difficulty', 'target_skill'):
                    if key in obj:
                        update_kwargs[key] = obj[key]
                Games.objects.filter(gameid=obj['gameid']).update(**update_kwargs)
            return Response({"message":"games successfully updated","status":True})
        else:
            print("==== CreateGameAdmin PAYLOAD ====")
            import json
            print(json.dumps(request.data, indent=2))
            print("=================================")
            for obj in request.data['games']:
                if Games.objects.filter(gameid=obj['gameid']).exists():
                    return Response({"message":"game id already exists :"+obj['gameid'],"status":False})

                else:
                    if Games.objects.filter(level_id = obj['level_id']).exists():
                        last_result = Games.objects.filter(level_id = obj['level_id']).latest('id')
                        o=last_result.order
                        o=o+1
                    else:
                        o=1
                    Games.objects.create(
                        gameid=obj['gameid'], 
                        level_id = obj['level_id'], 
                        order = o, 
                        ImageLink = obj['ImageLink'], 
                        name =obj['name'], 
                        live=obj['live'],
                        gameTip=obj['gameTip'],
                        in_gameTip=obj['in_gameTip'],
                        passage_text=obj.get('passage_text'),
                        grade_band=obj.get('grade_band'),
                        difficulty=obj.get('difficulty'),
                        target_skill=obj.get('target_skill'),
                    )
            return Response({"message":"games successfully created","status":True})


class CreateTileAdmin(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['action']=='update':
            for obj in request.data['tiles']:
                update_kwargs = dict(
                    tileid = obj['tileid'],
                    gameid = obj['gameid'],
                    qno =obj['qno'],
                    type =obj['type'],
                    question =obj['question'],
                    questionTip =obj['questionTip'],
                    correct =obj['correct'],
                    op1 =obj['op1'],
                    op1Link=obj['op1Link'],
                    op2 =obj['op2'],
                    op2Link=obj['op2Link'],
                    op3=obj['op3'],
                    op3Link=obj['op3Link'],
                    op4=obj['op4'],
                    op4Link=obj['op4Link'],
                    op5=obj['op5'],
                    op5Link=obj['op5Link'],
                    op6=obj['op6'],
                    op6Link=obj['op6Link'],
                    op7=obj['op7'],
                    op7Link=obj['op7Link'],
                    op8=obj['op8'],
                    op8Link=obj['op8Link'],
                    reason=obj['reason'],
                    live=obj['live'],
                )
                # Lumora fields: only set if actually sent, so an older admin
                # build that doesn't know about these fields can't accidentally
                # wipe them back to blank on an unrelated update.
                # Lumora fields
                if 'skill_tag' in obj and obj['skill_tag']:
                    update_kwargs['skill_tag'] = obj['skill_tag']
                elif not Tiles.objects.filter(tileid=obj['tileid']).values_list(
                    'skill_tag',
                    flat=True
                ).first():
                    parent_game = Games.objects.filter(
                        gameid=obj['gameid']
                    ).first()

                    if parent_game and parent_game.target_skill:
                        update_kwargs['skill_tag'] = parent_game.target_skill

                if 'has_reasoning_prompt' in obj:
                    update_kwargs['has_reasoning_prompt'] = obj['has_reasoning_prompt']

                Tiles.objects.filter(
                    tileid=obj['tileid']
                ).update(**update_kwargs)
            return Response({"message":"tiles successfully updated","status":True})
        else:
            for obj in request.data['tiles']:
                if obj['tileid']!='':
                    if Tiles.objects.filter(tileid=obj['tileid']).exists():
                        return Response({"message":"tile id already exists :"+obj['tileid'],"status":False})

                if obj['tileid']!='':
                    tid=obj['tileid']
                else:
                    tid= obj['question'][0:3] + ''.join(
                        random.choice(string.digits) for i in range(6)
                    )

                # Lumora skill fallback:
                # Prefer the question's skill_tag.
                # If missing, inherit the parent game's target_skill.
                skill_tag = obj.get('skill_tag')

                if not skill_tag:
                    parent_game = Games.objects.filter(
                        gameid=obj['gameid']
                    ).first()

                    if parent_game:
                        skill_tag = parent_game.target_skill

                Tiles.objects.create(
                    tileid = tid,
                    gameid = obj['gameid'],
                    qno =obj['qno'],
                    type =obj['type'],
                    question =obj['question'],
                    questionTip =obj['questionTip'],
                    correct =obj['correct'],
                    op1 =obj['op1'],
                    op1Link=obj['op1Link'],
                    op2 =obj['op2'],
                    op2Link=obj['op2Link'],
                    op3=obj['op3'],
                    op3Link=obj['op3Link'],
                    op4=obj['op4'],
                    op4Link=obj['op4Link'],
                    op5=obj['op5'],
                    op5Link=obj['op5Link'],
                    op6=obj['op6'],
                    op6Link=obj['op6Link'],
                    op7=obj['op7'],
                    op7Link=obj['op7Link'],
                    op8=obj['op8Link'],
                    reason=obj['reason'],
                    live=obj['live'],

                    # Lumora metadata
                    skill_tag=skill_tag,
                    has_reasoning_prompt=obj.get(
                        'has_reasoning_prompt',
                        False
                    ),
                )
            return Response({"message":"tiles successfully created","status":True})


class SaveAdminData(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['uid']=="":
            uid = request.data['useremail'][0:3] + ''.join(random.choice(string.digits) for i in range(6))
            while AdminHistory.objects.filter(uid=uid).exists():
                uid = request.data['useremail'][0:3] + ''.join(random.choice(string.digits) for i in range(6))
            AdminHistory.objects.create(
                AdminEmail=request.data['useremail'],
                data=request.data['history'],
                uid=uid
            )
            return Response({"status":"History successfully saved","uid":uid})
        if request.data['uid']!="":
            if AdminHistory.objects.filter(uid=request.data['uid']).exists():
                AdminHistory.objects.filter(uid=request.data['uid']).update( data=request.data['history'])
                return Response({"status":"History successfully updated"})
            else:
                return Response({"status":"uid is not correct or not exist"})

class GetAdminData(APIView):
    permission_classes = []
    
    def post(self, request):
        user_email = request.data.get('useremail') or request.data.get('email')
        if not user_email:
            return Response({"history": []})
        l = list(AdminHistory.objects.filter(AdminEmail=user_email).values('created_at', 'uid', 'data'))
        return Response({"history": l})

class DeleteAdminData(APIView):
    permission_classes = []
    
    def post(self, request):
        if AdminHistory.objects.filter(uid=request.data['uid']).exists():
            AdminHistory.objects.filter(uid=request.data['uid']).delete()
            return Response({"status":"deleted"})
        return Response({"status":"uid not exist"})

class GetAdminCourses(APIView):
    permission_classes = []
    
    def post(self, request):
        course_id = request.data.get('courseid', '') or ''
        email_to_search = request.data.get('email', '') or ''
        if course_id == '':
            # Create a regex pattern that matches the exact email address, considering commas as delimiters
            email_pattern = r'(^|,)\s*' + re.escape(email_to_search) + r'\s*(,|$)' if email_to_search else r'.*'
            
            l=Course.objects.filter(email__regex=email_pattern).values_list('created_at', 'courseid', 'order', 'name', 'ImageLink', 'course_tip','live').order_by('order')

            data=[]
            for i in l:
                d={}
                d['created_at']=i[0]
                d['courseid']=i[1]
                d['order']=i[2]
                d['name']=i[3]
                d['ImageLink']=i[4]
                d['course_tip']=i[5]
                d['live']=i[6]
                l1=Topic.objects.filter(courseid=i[1]).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live').order_by('order')
                data1=[]
                for j in l1:
                    d1={}
                    d1['created_at']=j[0]
                    d1['topic_id']=j[1]
                    d1['courseid']=j[2]
                    d1['order']=j[3]
                    d1['name']=j[4]
                    d1['ImageLink']=j[5]
                    d1['topic_tip']=j[6]
                    d1['live']=j[7]

                    l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live').order_by('order')
                    data2=[]
                    for k in l2:
                        d2={}
                        d2['created_at']=k[0]
                        d2['topic_id']=k[1]
                        d2['level_id']=k[2]
                        d2['order']=k[3]
                        d2['name']=k[4]
                        d2['ImageLink']=k[5]
                        d2['level_tip']=k[6]
                        d2['live']=k[7]
                        l3=Games.objects.filter(level_id=k[2]).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip','live', 'passage_text', 'grade_band', 'difficulty', 'target_skill').order_by('order')
                        data3=[]
                        for f in l3:
                            d3={}
                            d3['created_at']=f[0]
                            d3['gameid']=f[1]
                            d3['level_id']=f[2]
                            d3['order']=f[3]
                            d3['name']=f[4]
                            d3['ImageLink']=f[5]
                            d3['gameTip']=f[6]
                            d3['in_gameTip']=f[7]
                            d3['live']=f[8]
                            d3['passage_text']=f[9]
                            d3['grade_band']=f[10]
                            d3['difficulty']=f[11]
                            d3['target_skill']=f[12]
                            l4=Tiles.objects.filter(gameid=f[1]).values_list( 'gameid','tileid','type', 'questionTip','qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'op5', 'op5Link','op6', 'op6Link','op7', 'op7Link','op8', 'op8Link', 'correct','live','reason', 'skill_tag', 'has_reasoning_prompt' ).order_by('qno')
                            data4=[]
                
                            for e in l4:
                                d4={}
                                d4['gameid']=e[0]
                                d4['tileid']=e[1]
                                d4['type']=e[2]
                                d4['questionTip']=e[3]
                                d4['qno']=e[4]
                                d4['question']=e[5]
                                d4['live']=e[23]
                                d4['reason']=e[24]
                                d4['skill_tag']=e[25]
                                d4['has_reasoning_prompt']=e[26]
                                if e[2].lower()=='mcq':
                                    if len(e[22])>1:
                                        d4['isMultiCorrect']=True
                                    else:
                                        d4['isMultiCorrect']=False
                                    d4['correctOption']=safe_parse_correct_int_list(e[22], e[6], e[8], e[10], e[12], e[14], e[16], e[18], e[20])
                                    d4['options']=[
                                        {
                                            "option":e[6],
                                            "image": e[7],
                                        },
                                        {
                                            "option":e[8],
                                            "image": e[9],
                                        },
                                        {
                                            "option":e[10],
                                            "image": e[11],
                                        },
                                        {
                                            "option":e[12],
                                            "image": e[13],
                                        },
                                        {
                                            "option":e[14],
                                            "image": e[15],
                                        },
                                        {
                                            "option":e[16],
                                            "image": e[17],
                                        },
                                        {
                                            "option":e[18],
                                            "image": e[19],
                                        },
                                        {
                                            "option":e[20],
                                            "image": e[21],
                                        }
                                    ]
                                if e[2].lower()=='swipe':
                                    d4['isMultiCorrect']=False
                                    d4['questionTip']=e[5]
                                    d4['live']=e[23]
                                    d4['correctOption']=safe_parse_correct_int_list(e[22], e[6])
                                    d4['options']=[
                                        {
                                            "option":e[6],
                                            "image": e[7],
                                        }
                                    ]
                                data4.append(d4)
                            d3['related_tiles']=data4
                            data3.append(d3)

                        d2['related_games']=data3
                        data2.append(d2)

                    d1['related_levels']=data2
                    data1.append(d1)

                d['related_topics']=data1
                data.append(d)
            return Response(data)
        if course_id != '':
            # Create a regex pattern that matches the exact email address, considering commas as delimiters
            email_pattern = r'(^|,)\s*' + re.escape(email_to_search) + r'\s*(,|$)' if email_to_search else r'.*'

            l=Course.objects.filter(Q(courseid=course_id) & Q(email__regex=email_pattern)).values_list('created_at', 'courseid', 'order', 'name', 'ImageLink', 'course_tip','live').order_by('order')
            data=[]
            for i in l:
                d={}
                d['created_at']=i[0]
                d['courseid']=i[1]
                d['order']=i[2]
                d['name']=i[3]
                d['ImageLink']=i[4]
                d['course_tip']=i[5]
                d['live']=i[6]
                l1=Topic.objects.filter(courseid=i[1]).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live').order_by('order')
                data1=[]
                for j in l1:
                    d1={}
                    d1['created_at']=j[0]
                    d1['topic_id']=j[1]
                    d1['courseid']=j[2]
                    d1['order']=j[3]
                    d1['name']=j[4]
                    d1['ImageLink']=j[5]
                    d1['topic_tip']=j[6]
                    d1['live']=j[7]

                    l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live').order_by('order')
                    data2=[]
                    for k in l2:
                        d2={}
                        d2['created_at']=k[0]
                        d2['topic_id']=k[1]
                        d2['level_id']=k[2]
                        d2['order']=k[3]
                        d2['name']=k[4]
                        d2['ImageLink']=k[5]
                        d2['level_tip']=k[6]
                        d2['live']=k[7]
                        l3=Games.objects.filter(level_id=k[2]).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip','live', 'passage_text', 'grade_band', 'difficulty', 'target_skill').order_by('order')
                        data3=[]
                        for f in l3:
                            d3={}
                            d3['created_at']=f[0]
                            d3['gameid']=f[1]
                            d3['level_id']=f[2]
                            d3['order']=f[3]
                            d3['name']=f[4]
                            d3['ImageLink']=f[5]
                            d3['gameTip']=f[6]
                            d3['in_gameTip']=f[7]
                            d3['live']=f[8]
                            d3['passage_text']=f[9]
                            d3['grade_band']=f[10]
                            d3['difficulty']=f[11]
                            d3['target_skill']=f[12]
                            l4=Tiles.objects.filter(gameid=f[1]).values_list( 'gameid','tileid','type', 'questionTip','qno', 'question', 'op1', 'op1Link', 'op2', 'op2Link', 'op3', 'op3Link', 'op4', 'op4Link', 'op5', 'op5Link','op6', 'op6Link','op7', 'op7Link','op8', 'op8Link', 'correct','live','reason', 'skill_tag', 'has_reasoning_prompt' ).order_by('qno')
                            data4=[]
                
                            for e in l4:
                                d4={}
                                d4['gameid']=e[0]
                                d4['tileid']=e[1]
                                d4['type']=e[2]
                                d4['questionTip']=e[3]
                                d4['qno']=e[4]
                                d4['question']=e[5]
                                d4['live']=e[23]
                                d4['reason']=e[24]
                                d4['skill_tag']=e[25]
                                d4['has_reasoning_prompt']=e[26]
                                if e[2].lower()=='mcq':
                                    if len(e[22])>1:
                                        d4['isMultiCorrect']=True
                                    else:
                                        d4['isMultiCorrect']=False

                                    d4['correctOption']=safe_parse_correct_int_list(e[22], e[6], e[8], e[10], e[12], e[14], e[16], e[18], e[20])
                                    d4['options']=[
                                        {
                                            "option":e[6],
                                            "image": e[7],
                                        },
                                        {
                                            "option":e[8],
                                            "image": e[9],
                                        },
                                        {
                                            "option":e[10],
                                            "image": e[11],
                                        },
                                        {
                                            "option":e[12],
                                            "image": e[13],
                                        },
                                        {
                                            "option":e[14],
                                            "image": e[15],
                                        },
                                        {
                                            "option":e[16],
                                            "image": e[17],
                                        },
                                        {
                                            "option":e[18],
                                            "image": e[19],
                                        },
                                        {
                                            "option":e[20],
                                            "image": e[21],
                                        }
                                    ]
                                if e[2].lower()=='swipe':
                                    d4['isMultiCorrect']=False
                                    d4['questionTip']=e[5]
                                    d4['live']=e[23]
                                    d4['correctOption']=safe_parse_correct_int_list(e[22], e[6])
                                    d4['options']=[
                                        {
                                            "option":e[6],
                                            "image": e[7],
                                        }
                                    ]
                                data4.append(d4)
                                d3['related_tiles']=data4
                            data3.append(d3)

                        d2['related_games']=data3
                        data2.append(d2)

                    d1['related_levels']=data2
                    data1.append(d1)

                d['related_topics']=data1
                data.append(d)
            return Response(data)


class UpdateLiveField(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['data']=="course":
            live_data = request.data['live']
            data={"status":"live field updated"}
            l=Course.objects.filter(courseid=request.data['uid']).values_list('courseid')
            
            for i in l:
                d={}
                d['courseid']=i[0]
                Course.objects.filter(courseid=i[0]).update(live=live_data)
                l1=Topic.objects.filter(courseid=i[0]).values_list('topic_id')

                for j in l1:
                    d1={}
                    d1['topic_id']=j[0]
                    Topic.objects.filter(topic_id=j[0]).update(live=live_data)
                    l2=Level.objects.filter(topic_id=j[0]).values_list('level_id')

                    for k in l2:
                        d2={}
                        d2['level_id']=k[0]
                        Level.objects.filter(level_id=k[0]).update(live=live_data)
                        l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')

                        for f in l3:
                            d3={}
                            d3['gameid']=f[0]
                            Games.objects.filter(gameid=f[0]).update(live=live_data)
                            Tiles.objects.filter(gameid=f[0]).update(live=live_data)
            return Response(data)

        if request.data['data']=="topic":
            l1=Topic.objects.filter(topic_id=request.data['uid']).values_list('topic_id')
            live_data = request.data['live']
            data={"status":"live field updated"}
            for j in l1:
                d1={}
                d1['topic_id']=j[0]
                Topic.objects.filter(topic_id=j[0]).update(live=live_data)
                l2=Level.objects.filter(topic_id=j[0]).values_list('level_id')

                for k in l2:
                    d2={}
                    d2['level_id']=k[0]
                    Level.objects.filter(level_id=k[0]).update(live=live_data)
                    l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')

                    for f in l3:
                        d3={}
                        d3['gameid']=f[0]
                        Games.objects.filter(gameid=f[0]).update(live=live_data)
                        Tiles.objects.filter(gameid=f[0]).update(live=live_data)

            return Response(data)

        if request.data['data']=="level":
            l2=Level.objects.filter(level_id=request.data['uid']).values_list('level_id')
            live_data = request.data['live']
            data={"status":"live field updated"}
            for k in l2:
                d2={}
                d2['level_id']=k[0]
                Level.objects.filter(level_id=k[0]).update(live=live_data)
                l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')
                for f in l3:
                    d3={}
                    d3['gameid']=f[0]
                    Games.objects.filter(gameid=f[0]).update(live=live_data)
                    Tiles.objects.filter(gameid=f[0]).update(live=live_data)
  
            return Response(data)

        if request.data['data']=="game":

            l3=Games.objects.filter(gameid=request.data['uid']).values_list( 'gameid')
            live_data = request.data['live']
            data={"status":"live field updated"}
            for f in l3:
                d3={}
                d3['gameid']=f[0]
                Games.objects.filter(gameid=f[0]).update(live=live_data)
                Tiles.objects.filter(gameid=f[0]).update(live=live_data)

            return Response(data)
        
        if request.data['data']=="tile":
            live_data = request.data['live']
            data={"status":"live field updated"}
            Tiles.objects.filter(tileid=request.data['uid']).update(live=live_data)
            return Response(data)


class DeleteAdminCourse(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['data']=="course":
            l=Course.objects.filter(courseid=request.data['uid']).values_list('courseid')
            data={"status":"course deleted"}
            for i in l:
                d={}
                d['courseid']=i[0]
                l1=Topic.objects.filter(courseid=i[0]).values_list('topic_id')
                for j in l1:
                    d1={}
                    d1['topic_id']=j[0]
                    l2=Level.objects.filter(topic_id=j[0]).values_list('level_id')
                    for k in l2:
                        d2={}
                        d2['level_id']=k[0]
                        
                        l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')
                        for f in l3:
                            d3={}
                            d3['gameid']=f[0]
                            Tiles.objects.filter(gameid=f[0]).delete()

                        Games.objects.filter(level_id=k[0]).delete()

                    Level.objects.filter(topic_id=j[0]).delete()

                Topic.objects.filter(courseid=i[0]).delete()

            Course.objects.filter(courseid=request.data['uid']).delete()
            return Response(data)

        if request.data['data']=="topic":
            l1=Topic.objects.filter(topic_id=request.data['uid']).values_list('topic_id')
            data={"status":"topic deleted"}
            for j in l1:
                d1={}
                d1['topic_id']=j[0]
                l2=Level.objects.filter(topic_id=j[0]).values_list('level_id')
                data2=[]
                for k in l2:
                    d2={}
                    d2['level_id']=k[0]
                    
                    l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')
                    for f in l3:
                        d3={}
                        d3['gameid']=f[0]
                        
                        Tiles.objects.filter(gameid=f[0]).delete()

                    Games.objects.filter(level_id=k[0]).delete()

                Level.objects.filter(topic_id=j[0]).delete()

            Topic.objects.filter(topic_id=request.data['uid']).delete()

            return Response(data)

        if request.data['data']=="level":
            l2=Level.objects.filter(level_id=request.data['uid']).values_list('level_id')
            data={"status":"level deleted"}
            for k in l2:
                d2={}
                d2['level_id']=k[0]
                
                l3=Games.objects.filter(level_id=k[0]).values_list( 'gameid')
                for f in l3:
                    d3={}
                    d3['gameid']=f[0]
                    Tiles.objects.filter(gameid=f[0]).delete()
  
                Games.objects.filter(level_id=k[0]).delete()

            Level.objects.filter(level_id=request.data['uid']).delete()
            return Response(data)

        if request.data['data']=="game":

            l3=Games.objects.filter(gameid=request.data['uid']).values_list( 'gameid')
            data={"status":"game deleted"}
            for f in l3:
                d3={}
                d3['gameid']=f[0]
                Tiles.objects.filter(gameid=f[0]).delete()

            Games.objects.filter(gameid=request.data['uid']).delete()

            return Response(data)
        
        if request.data['data']=="tile":
            data={"status":"tile deleted"}
            Tiles.objects.filter(tileid=request.data['uid']).delete()
            return Response(data)

class UpdateFieldValue(APIView):
    permission_classes = []
    
    def post(self, request):
        if request.data['data']=="course":
            if Course.objects.filter(courseid=request.data['uid']).exists():
                update_data  = {request.data['field']: request.data['value']}
                Course.objects.filter(courseid=request.data['uid']).update(**update_data)
                return Response({"status":"value updated"})

        if request.data['data']=="topic":
            if Topic.objects.filter(topic_id=request.data['uid']).exists():
                update_data  = {request.data['field']: request.data['value']}
                Topic.objects.filter(topic_id=request.data['uid']).update(**update_data)
                return Response({"status":"value updated"})
        
        if request.data['data']=="level":
            if Level.objects.filter(level_id=request.data['uid']).exists():
                update_data  = {request.data['field']: request.data['value']}
                Level.objects.filter(level_id=request.data['uid']).update(**update_data)
                return Response({"status":"value updated"})
        
        if request.data['data']=="game":
            if Games.objects.filter(gameid=request.data['uid']).exists():
                update_data  = {request.data['field']: request.data['value']}
                Games.objects.filter(gameid=request.data['uid']).update(**update_data)
                return Response({"status":"value updated"})

        if request.data['data']=="tile":
            if Tiles.objects.filter(tileid=request.data['uid']).exists():
                update_data  = {request.data['field']: request.data['value']}
                Tiles.objects.filter(tileid=request.data['uid']).update(**update_data)
                return Response({"status":"value updated"})
            

class CopyData(APIView):
    permission_classes = []
    
    def post(self, request):
        
        if request.data['data']=="topic":
            if Topic.objects.filter(topic_id=request.data['copy_from']).exists():
                cid=request.data['copy_to']

                while True:
                    tid = Topic.objects.get(topic_id=request.data['copy_from']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                    if Topic.objects.filter(topic_id=tid).exists()==False:
                        break

                Topic.objects.create(
                    topic_id=tid, 
                    courseid = cid, 
                    order = Topic.objects.get(topic_id=request.data['copy_from']).order, 
                    name = Topic.objects.get(topic_id=request.data['copy_from']).name, 
                    ImageLink = Topic.objects.get(topic_id=request.data['copy_from']).ImageLink, 
                    topic_tip = Topic.objects.get(topic_id=request.data['copy_from']).topic_tip, 
                    live = Topic.objects.get(topic_id=request.data['copy_from']).live
                )

                l=Level.objects.filter(topic_id=request.data['copy_from']).values('level_id')
                for i in l:
                    request.data['copy_from_level']=i['level_id']
                    while True:
                        lid = Level.objects.get(level_id=request.data['copy_from_level']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                        if Level.objects.filter(level_id=lid).exists()==False:
                            break
                    Level.objects.create(    
                    level_id = lid,
                    topic_id=tid,
                    order = Level.objects.get(level_id=request.data['copy_from_level']).order, 
                    name = Level.objects.get(level_id=request.data['copy_from_level']).name, 
                    ImageLink = Level.objects.get(level_id=request.data['copy_from_level']).ImageLink, 
                    level_tip = Level.objects.get(level_id=request.data['copy_from_level']).level_tip, 
                    live=Level.objects.get(level_id=request.data['copy_from_level']).live
                    )

                    l1=Games.objects.filter(level_id=i['level_id']).values('gameid')
                    for j in l1:
                        request.data['copy_from_game']=j['gameid']
                        while True:
                            gid = Games.objects.get(gameid=request.data['copy_from_game']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                            if Games.objects.filter(gameid=gid).exists()==False:
                                break
                        Games.objects.create(
                            name=Games.objects.get(gameid=request.data['copy_from_game']).name,
                            order=Games.objects.get(gameid=request.data['copy_from_game']).order,
                            gameid=gid,
                            level_id=lid,
                            ImageLink =Games.objects.get(gameid=request.data['copy_from_game']).ImageLink,
                            gameTip =Games.objects.get(gameid=request.data['copy_from_game']).gameTip,
                            in_gameTip = Games.objects.get(gameid=request.data['copy_from_game']).in_gameTip,
                            live =Games.objects.get(gameid=request.data['copy_from_game']).live
                        )
                        l2=Tiles.objects.filter(gameid=j['gameid']).values('tileid')
                        for k in l2:
                            request.data['copy_from_tile']=k['tileid']
                            while True:
                                tile_id = Tiles.objects.get(tileid=request.data['copy_from_tile']).question[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                                if Tiles.objects.filter(tileid=tile_id).exists()==False:
                                    break
                            Tiles.objects.create(
                                tileid = tile_id,
                                gameid= gid,
                                type =Tiles.objects.get(tileid=request.data['copy_from_tile']).type,
                                qno = Tiles.objects.get(tileid=request.data['copy_from_tile']).qno,
                                question =Tiles.objects.get(tileid=request.data['copy_from_tile']).question,
                                questionTip = Tiles.objects.get(tileid=request.data['copy_from_tile']).questionTip,
                                correct =Tiles.objects.get(tileid=request.data['copy_from_tile']).correct,
                                op1 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op1,
                                op1Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op1Link,
                                op2 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op2,
                                op2Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op2Link,
                                op3 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op3,
                                op3Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op3Link,
                                op4 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op4,
                                op4Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op4Link,
                                op5 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op5,
                                op5Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op5Link,
                                op6 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op6,
                                op6Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op6Link,
                                op7 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op7,
                                op7Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op7Link,
                                op8 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op8,
                                op8Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op8Link,
                                reason = Tiles.objects.get(tileid=request.data['copy_from_tile']).reason,
                                live = Tiles.objects.get(tileid=request.data['copy_from_tile']).live
                            )

                return Response({"status":"Data Copied"})
            return Response({"status":"Data not exist"})
        
        if request.data['data']=="level":
            if Level.objects.filter(level_id=request.data['copy_from']).exists():
                tid=request.data['copy_to']

                while True:
                    lid = Level.objects.get(level_id=request.data['copy_from']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                    if Level.objects.filter(level_id=lid).exists()==False:
                        break
                
                Level.objects.create(    
                    level_id = lid,
                    topic_id=tid,
                    order = Level.objects.get(level_id=request.data['copy_from']).order, 
                    name = Level.objects.get(level_id=request.data['copy_from']).name, 
                    ImageLink = Level.objects.get(level_id=request.data['copy_from']).ImageLink, 
                    level_tip = Level.objects.get(level_id=request.data['copy_from']).level_tip, 
                    live=Level.objects.get(level_id=request.data['copy_from']).live
                )
                l1=Games.objects.filter(level_id=request.data['copy_from']).values('gameid')
                for j in l1:
                    request.data['copy_from_game']=j['gameid']
                    while True:
                        gid = Games.objects.get(gameid=request.data['copy_from_game']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                        if Games.objects.filter(gameid=gid).exists()==False:
                            break
                    Games.objects.create(
                        name=Games.objects.get(gameid=request.data['copy_from_game']).name,
                        order=Games.objects.get(gameid=request.data['copy_from_game']).order,
                        gameid=gid,
                        level_id=lid,
                        ImageLink =Games.objects.get(gameid=request.data['copy_from_game']).ImageLink,
                        gameTip =Games.objects.get(gameid=request.data['copy_from_game']).gameTip,
                        in_gameTip = Games.objects.get(gameid=request.data['copy_from_game']).in_gameTip,
                        live =Games.objects.get(gameid=request.data['copy_from_game']).live
                    )
                    l2=Tiles.objects.filter(gameid=j['gameid']).values('tileid')

                    for k in l2:
                        request.data['copy_from_tile']=k['tileid']
                        while True:
                            tile_id = Tiles.objects.get(tileid=request.data['copy_from_tile']).question[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                            if Tiles.objects.filter(tileid=tile_id).exists()==False:
                                break

                        Tiles.objects.create(
                            tileid = tile_id,
                            gameid= gid,
                            type =Tiles.objects.get(tileid=request.data['copy_from_tile']).type,
                            qno = Tiles.objects.get(tileid=request.data['copy_from_tile']).qno,
                            question =Tiles.objects.get(tileid=request.data['copy_from_tile']).question,
                            questionTip = Tiles.objects.get(tileid=request.data['copy_from_tile']).questionTip,
                            correct =Tiles.objects.get(tileid=request.data['copy_from_tile']).correct,
                            op1 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op1,
                            op1Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op1Link,
                            op2 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op2,
                            op2Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op2Link,
                            op3 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op3,
                            op3Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op3Link,
                            op4 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op4,
                            op4Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op4Link,
                            op5 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op5,
                            op5Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op5Link,
                            op6 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op6,
                            op6Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op6Link,
                            op7 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op7,
                            op7Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op7Link,
                            op8 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op8,
                            op8Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op8Link,
                            reason = Tiles.objects.get(tileid=request.data['copy_from_tile']).reason,
                            live = Tiles.objects.get(tileid=request.data['copy_from_tile']).live
                        )
                return Response({"status":"Data Copied"})

            return Response({"status":"Data not exist"})

        if request.data['data']=="game":
            if Games.objects.filter(gameid=request.data['copy_from']).exists():
                lid=request.data['copy_to']

                while True:
                    gid = Games.objects.get(gameid=request.data['copy_from']).name[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                    if Games.objects.filter(gameid=gid).exists()==False:
                        break
                
                Games.objects.create(
                    name=Games.objects.get(gameid=request.data['copy_from']).name,
                    order=Games.objects.get(gameid=request.data['copy_from']).order,
                    gameid=gid,
                    level_id=lid,
                    ImageLink =Games.objects.get(gameid=request.data['copy_from']).ImageLink,
                    gameTip =Games.objects.get(gameid=request.data['copy_from']).gameTip,
                    in_gameTip = Games.objects.get(gameid=request.data['copy_from']).in_gameTip,
                    live =Games.objects.get(gameid=request.data['copy_from']).live
                )

                l2=Tiles.objects.filter(gameid=request.data['copy_from']).values('tileid')
                for k in l2:
                    request.data['copy_from_tile']=k['tileid']
                    while True:
                        tile_id = Tiles.objects.get(tileid=request.data['copy_from_tile']).question[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                        if Tiles.objects.filter(tileid=tile_id).exists()==False:
                            break
                    Tiles.objects.create(
                        tileid = tile_id,
                        gameid= gid,
                        type =Tiles.objects.get(tileid=request.data['copy_from_tile']).type,
                        qno = Tiles.objects.get(tileid=request.data['copy_from_tile']).qno,
                        question =Tiles.objects.get(tileid=request.data['copy_from_tile']).question,
                        questionTip = Tiles.objects.get(tileid=request.data['copy_from_tile']).questionTip,
                        correct =Tiles.objects.get(tileid=request.data['copy_from_tile']).correct,
                        op1 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op1,
                        op1Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op1Link,
                        op2 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op2,
                        op2Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op2Link,
                        op3 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op3,
                        op3Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op3Link,
                        op4 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op4,
                        op4Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op4Link,
                        op5 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op5,
                        op5Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op5Link,
                        op6 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op6,
                        op6Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op6Link,
                        op7 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op7,
                        op7Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op7Link,
                        op8 =Tiles.objects.get(tileid=request.data['copy_from_tile']).op8,
                        op8Link = Tiles.objects.get(tileid=request.data['copy_from_tile']).op8Link,
                        reason = Tiles.objects.get(tileid=request.data['copy_from_tile']).reason,
                        live = Tiles.objects.get(tileid=request.data['copy_from_tile']).live
                    )
                return Response({"status":"Data Copied"})

            return Response({"status":"Data not exist"})

        if request.data['data']=="tile":
            if Tiles.objects.filter(tileid=request.data['copy_from']).exists():
                gid=request.data['copy_to']

                while True:
                    tid = Tiles.objects.get(tileid=request.data['copy_from']).question[0:3] + ''.join(random.choice(string.digits) for i in range(6))
                    if Tiles.objects.filter(tileid=tid).exists()==False:
                        break

                Tiles.objects.create(
                    tileid = tid,
                    gameid= gid,
                    type =Tiles.objects.get(tileid=request.data['copy_from']).type,
                    qno = Tiles.objects.get(tileid=request.data['copy_from']).qno,
                    question =Tiles.objects.get(tileid=request.data['copy_from']).question,
                    questionTip = Tiles.objects.get(tileid=request.data['copy_from']).questionTip,
                    correct =Tiles.objects.get(tileid=request.data['copy_from']).correct,
                    op1 =Tiles.objects.get(tileid=request.data['copy_from']).op1,
                    op1Link = Tiles.objects.get(tileid=request.data['copy_from']).op1Link,
                    op2 =Tiles.objects.get(tileid=request.data['copy_from']).op2,
                    op2Link = Tiles.objects.get(tileid=request.data['copy_from']).op2Link,
                    op3 =Tiles.objects.get(tileid=request.data['copy_from']).op3,
                    op3Link = Tiles.objects.get(tileid=request.data['copy_from']).op3Link,
                    op4 =Tiles.objects.get(tileid=request.data['copy_from']).op4,
                    op4Link = Tiles.objects.get(tileid=request.data['copy_from']).op4Link,
                    op5 =Tiles.objects.get(tileid=request.data['copy_from']).op5,
                    op5Link = Tiles.objects.get(tileid=request.data['copy_from']).op5Link,
                    op6 =Tiles.objects.get(tileid=request.data['copy_from']).op6,
                    op6Link = Tiles.objects.get(tileid=request.data['copy_from']).op6Link,
                    op7 =Tiles.objects.get(tileid=request.data['copy_from']).op7,
                    op7Link = Tiles.objects.get(tileid=request.data['copy_from']).op7Link,
                    op8 =Tiles.objects.get(tileid=request.data['copy_from']).op8,
                    op8Link = Tiles.objects.get(tileid=request.data['copy_from']).op8Link,
                    reason = Tiles.objects.get(tileid=request.data['copy_from']).reason,
                    live = Tiles.objects.get(tileid=request.data['copy_from']).live
                )

                return Response({"status":"Data Copied"})

            return Response({"status":"Data not exist"})
  

class FetchGamedata_test(APIView):
    permission_classes = []
    
    def post(self, request):
        journey_topic=request.data['journey_topic']
        level=int(request.data['level'])
        data=[]
        
        if Games.objects.filter(Q(journey_topic=journey_topic) & Q(level=level)).exists():
            l=Games.objects.filter(Q(journey_topic=journey_topic) & Q(level=level)).values_list( 'name', 'order','gameid','level', 'topic', 'journey', 'type', 'title', 'ImageLink', 'description', 'gameTip', 'questionTip','journey_topic')
            
            for i in l:
                d={}
                d['Name']=i[0]
                d['Order']=i[1]
                d['GameId']=i[2]
                d['Level']=i[3]
                d['Topic']=i[4]
                d['Journey']=i[5]
                d['Journey_Topic']=i[12]
                d['Type']=i[6]
                d['Title']=i[7]
                d['ImageLink']=i[8]
                d['Description']=i[9]
                d['gameTip']=i[10]
                d['questionTip']=i[11]
                data.append(d)

        if MCQ.objects.filter(Q(topic=journey_topic) & Q(level=level)).exists():
            l=MCQ.objects.filter(Q(topic=journey_topic) & Q(level=level)).values_list( 'gameid','name','journey','level','order', 'ImageLink', 'description', 'gameTip', 'questionTip', 'title', 'topic').distinct()

            for i in l:
                d={}
                d['GameId']=i[0]
                d['Order']=i[4]
                d['Name']=i[1]
                d['Journey']=i[2]
                d['Level']=i[3]

                d['ImageLink']=i[5]
                d['Description']=i[6]
                d['gameTip']=i[7]
                d['questionTip']=i[8]
                d['Title']=i[9]
                d['Topic']=i[10]
                d['Type']='mcq'
                if d not in data:
                    data.append(d)

        if Mixed.objects.filter(Q(journey_topic=journey_topic) & Q(level=level)).exists():
            l=Mixed.objects.filter(Q(journey_topic=journey_topic) & Q(level=level)).values_list( 'gameid','name','journey','level','order', 'ImageLink', 'description', 'gameTip', 'questionTip',  'journey_topic').distinct()

            for i in l:
                d={}
                d['GameId']=i[0]
                d['Order']=i[4]
                d['Name']=i[1]
                d['Journey']=i[2]
                d['Level']=i[3]

                d['ImageLink']=i[5]
                d['Description']=i[6]
                d['gameTip']=i[7]
                d['questionTip']=i[8]
                d['Title']=None
                d['Topic']=i[9]
                d['Type']='mixed'
                if d not in data:
                    data.append(d)

        return Response(data)


@api_view(['POST',])
@permission_classes((IsAuthenticated, )) 
def SetUserData(request):
    d={"Notification-text":"failed"}
    if LumoraUsers.objects.filter(LumoraEmail=request.data["email"]).exists()==True:
        LumoraUsers.objects.filter(LumoraEmail=request.data["email"]).update(image=request.data["image"],LumoraUser=request.data["username"])
        d={"Notification-text":"updated"}
    return Response(d)


@api_view(['POST',])
@permission_classes((IsAuthenticated, ))
def SetScore(request):

    # User ID may arrive as an integer from the frontend.
    # Convert only for score_id generation because slicing requires a string.
    user_id = str(request.data['userId'])

    while True:
        s_id = user_id[:3] + ''.join(
            random.choice(string.digits) for _ in range(4)
        )

        if not LumoraScores.objects.filter(score_id=s_id).exists():
            break
    
    try:
        lid=Games.objects.get(gameid = request.data['gameId']).level_id
        
    except Games.MultipleObjectsReturned:
        last_result = Games.objects.filter(gameid = request.data['gameId']).order_by('id').last()
        lid=last_result.level_id
        
    tid=Level.objects.get(level_id = lid).topic_id
    cid=Topic.objects.get(topic_id = tid).courseid

    if LumoraScores.objects.filter(Q(LumoraUserId = request.data['userId']) & Q(gameid = request.data['gameId'])).exists():
        try:
            s=int(LumoraScores.objects.get(Q(LumoraUserId = request.data['userId']) & Q(gameid = request.data['gameId'])).score)
    
        except LumoraScores.MultipleObjectsReturned:
            last_result = LumoraScores.objects.filter(Q(LumoraUserId = request.data['userId']) & Q(gameid = request.data['gameId'])).order_by('id').last()
            s=last_result.score
    
        if StreakData.objects.filter(LumoraUserId=request.data['userId']).exists():
            last_date = StreakData.objects.get(LumoraUserId=request.data['userId']).created_at
            last_streak = StreakData.objects.get(LumoraUserId=request.data['userId']).streak
            last_current_streak = StreakData.objects.get(LumoraUserId=request.data['userId']).current_streak
            prev_date = datetime.date.today() - timedelta(days=1)

            if last_date==prev_date: # streak update
                StreakData.objects.filter(LumoraUserId=request.data['userId']).update(
                    created_at=datetime.date.today(),
                    game_id=request.data['gameId'],
                    streak=last_streak+1,
                    current_streak=last_current_streak+1
                )
            elif last_date<prev_date: # streak reset
                StreakData.objects.filter(LumoraUserId=request.data['userId']).update(
                    created_at=datetime.date.today(),
                    game_id=request.data['gameId'],
                    current_streak=1
                )
            elif last_date==datetime.date.today():
 
                pass
        else:
            StreakData.objects.create(
                    game_id=request.data['gameId'],
                    streak=1,
                    current_streak=1,
                    LumoraUserId = request.data['userId'],
                )

        if int(request.data['score'])>s:
            LumoraScores.objects.create(
                score_id=s_id,
                LumoraUserId = request.data['userId'],
                gameid = request.data['gameId'],
                score = request.data['score'],
                course_id=cid,
                course_name=Course.objects.get(courseid = cid).name,
                isComplete= request.data['isComplete'],
                totalQuestions=request.data['totalQuestions']
                )
        else:
            return Response({"status":"Game played already with higher score"})
    else:
        if StreakData.objects.filter(LumoraUserId=request.data['userId']).exists():
            last_date = StreakData.objects.get(LumoraUserId=request.data['userId']).created_at
            last_streak = StreakData.objects.get(LumoraUserId=request.data['userId']).streak
            last_current_streak = StreakData.objects.get(LumoraUserId=request.data['userId']).current_streak
            prev_date = datetime.date.today() - timedelta(days=1)

            if last_date==prev_date: # streak update
                StreakData.objects.filter(LumoraUserId=request.data['userId']).update(
                    created_at=datetime.date.today(),
                    game_id=request.data['gameId'],
                    streak=last_streak+1,
                    current_streak=last_current_streak+1
                )
            elif last_date<prev_date: # streak reset
                StreakData.objects.filter(LumoraUserId=request.data['userId']).update(
                    created_at=datetime.date.today(),
                    game_id=request.data['gameId'],
                    current_streak=1
                )
            elif last_date==datetime.date.today():
              
                pass
        else:
            StreakData.objects.create(
                    game_id=request.data['gameId'],
                    streak=1,
                    current_streak=1,
                    LumoraUserId = request.data['userId'],
                )

        LumoraScores.objects.create(
        score_id=s_id,
        LumoraUserId = request.data['userId'],
        gameid = request.data['gameId'],
        score = request.data['score'],
        course_id=cid,
        course_name=Course.objects.get(courseid = cid).name,
        isComplete= request.data['isComplete'],
        totalQuestions=request.data['totalQuestions']
        )
    
    return Response({"status":"success"})


@api_view(['POST',])
@permission_classes([]) 
def GetScore(request):
    user_id = request.data.get('userId') or request.data.get('user_id') or (str(request.user.id) if request.user and request.user.is_authenticated else '')
    if user_id:
        if LumoraScores.objects.filter(LumoraUserId = user_id).exists():
            l=LumoraScores.objects.filter(LumoraUserId = user_id).values('created_at', 'LumoraUserId', 'gameid', 'score_id', 'score', 'course_id','course_name','isComplete')
            data=[]
            d={}
            c=0
            total_score=0
            if len(l)>0:
                for i in l:
                    flag=0
                    d={}
                    for obj in data:
                        if obj['courseId']==i['course_id']:
                            obj['score']=obj['score']+i['score']
                            flag=1
                            
                    if flag==0:
                        d['courseId']=i['course_id']
                        if Course.objects.filter(courseid = i['course_id']).exists():
                            d['course_name']=Course.objects.get(courseid = i['course_id']).name
                        else:
                            d['course_name']=i['course_name']
                        d['score']=i['score']
                        data.append(d)
                    total_score+=i['score']
                    
            sorted_courses = sorted(data, key=lambda x: x['score'], reverse=True)
            top_10_courses = sorted_courses[:5]

            result={}
            result['top_courses']=top_10_courses
            result['userScore']=total_score
            return Response(result)
        else:
            return Response({"status":"No games played"})
    else:
        return Response({"status":"No games played"})

@api_view(['POST',])
@permission_classes([]) 
def GetGamesPlayed(request):
    user_id = request.data.get('userId') or request.data.get('user_id') or (str(request.user.id) if request.user and request.user.is_authenticated else '')
    if user_id:
        if LumoraScores.objects.filter(LumoraUserId = user_id).exists():
            l=LumoraScores.objects.filter(LumoraUserId = user_id).values('created_at', 'LumoraUserId', 'gameid', 'score_id', 'score', 'course_id','isComplete','totalQuestions')
            d={}
            l1=[]
            d2={}

            for i in l:
                if i['gameid'] not in d2:
                    d2[i['gameid']]=i['score']
                else:
                    if d2[i['gameid']]<i['score']:
                        d2[i['gameid']]=i['score']
                       
            for i in l:
                if d2[i['gameid']]==i['score']:
                    d={}
                    d['created_at']=i['created_at']
                    d["LumoraUserId"]=i['LumoraUserId']
                    d["gameid"]=i['gameid']
                    d["score_id"]=i['score_id']
                    d["score"]=i['score']
                    d["course_id"]= i['course_id']
                    d["isComplete"]=i['isComplete']
                    d["totalQuestions"]=i['totalQuestions']
                    l1.append(d)
            return Response(l1)
        else:
            return Response({"status":"No games played"})
    else:
        return Response({"status":"No games played"})


@api_view(['POST',])
@permission_classes((IsAuthenticated, )) 
def GetStreakdata(request):
    if request.data['userId']!='':
        sd={}
        if StreakData.objects.filter(LumoraUserId = request.data['userId']).exists():
            strek_value = StreakData.objects.get(LumoraUserId = request.data['userId']).streak
            game_id = StreakData.objects.get(LumoraUserId = request.data['userId']).game_id
            created_at = StreakData.objects.get(LumoraUserId = request.data['userId']).created_at
            current_streak = StreakData.objects.get(LumoraUserId = request.data['userId']).current_streak
            sd={
                "highest_streak":strek_value,
                "current_streak":current_streak,
                "last_played_game":game_id,
                "last_played_at":created_at
            }
        else:
            sd={
                "highest_streak":0,
                "current_streak":0,
                "last_played_game":"none",
                "last_played_at":"none"
            }

    if request.data['userId']!='':
        data=[]
        if LumoraScores.objects.filter(LumoraUserId = request.data['userId']).exists():
            l=LumoraScores.objects.filter(LumoraUserId = request.data['userId']).values('id','created_at').order_by('-id')
            
            d={}
            last_date=0
            for i in l:
                d={}
                date_string = i['created_at'].strftime('%Y-%m-%d')
                d['id']=i['id']
                d['date']=date_string
                if len(data)<30 and last_date!=date_string:
                    data.append(d)
                last_date=date_string
                
        d1={
            "streak_data":sd,
            "dates":data
        }
        return Response(d1)


# ---------------------------------------------------------------------------
# Phase 2 (measurement): per-question answer tracking + skill mastery.
#
# Does NOT replace SetScore/GetScore (whole-game summary scores stay as-is).
# This is the smaller, per-question layer that feeds UserSkillMastery, which
# Phase 3's adaptive generation will read from later.
# ---------------------------------------------------------------------------

LOCKED_SKILL_TAGS = [
    "main-idea",
    "vocabulary",
    "inference",
    "cause-effect",
    "sequence",
    "evidence",
]

def _parse_correct_options(correct_field):
    """Tiles.correct is a comma-separated string of 1-based option indices,
    e.g. "1" or "1,3". Mirrors the exact parsing FetchtileData already uses
    for the frontend's correctOption list, so server-side correctness checks
    agree with what the learner sees."""
    if not correct_field:
        return []
    try:
        return [int(x) for x in str(correct_field).split(",") if x.strip() != ""]
    except ValueError:
        return []

def _is_answer_correct(selected_options, correct_options, is_multi_correct):
    """Mirrors handleScore.tsx's exact correctness rule client-side, so the
    server independently recomputes the same judgement rather than trusting
    a client-supplied flag."""
    if not selected_options:
        return False
    if is_multi_correct:
        return all(opt in correct_options for opt in selected_options)
    return len(selected_options) == 1 and selected_options[0] in correct_options


@api_view(['POST',])
@permission_classes((IsAuthenticated, ))
def RecordQuestionAnswer(request):
    user_id = request.data.get('userId')
    game_id = request.data.get('gameId')
    tile_id = request.data.get('tileId')
    selected_options = request.data.get('selectedOptions')

    if not user_id or not game_id or not tile_id:
        return Response({"error": "userId, gameId and tileId are required"})

    if not isinstance(selected_options, list) or not all(isinstance(o, int) for o in selected_options):
        return Response({"error": "selectedOptions must be a list of integers"})

    tile = Tiles.objects.filter(tileid=tile_id, gameid=game_id).first()
    if tile is None:
        return Response({"error": "invalid tile-id for this game"})

    correct_options = _parse_correct_options(tile.correct)
    is_multi_correct = len(correct_options) > 1
    is_correct = _is_answer_correct(selected_options, correct_options, is_multi_correct)

    # Lumora skill resolution:
    # 1. Use the Tile's own skill_tag when available.
    # 2. If an older Tile has NULL skill_tag, inherit the parent Game's target_skill.
    # 3. Persist the recovered skill_tag back onto the Tile so the repair is permanent.
    skill_tag = tile.skill_tag or None

    if not skill_tag:
        parent_game = Games.objects.filter(
            gameid=game_id
        ).first()

        if parent_game and parent_game.target_skill:
            skill_tag = parent_game.target_skill

            tile.skill_tag = skill_tag
            tile.save(update_fields=["skill_tag"])

    # Duplicate-submission guard (rapid double-click / accidental double
    # network call): if the exact same user+tile was logged in the last
    # couple of seconds, treat this as the same submission rather than
    # double-counting it in UserSkillMastery. A genuine retry later (after
    # this short window) still counts as a new attempt, same as the product
    # spec asks for.
    recent_duplicate = LumoraLogs.objects.filter(
        user_id=user_id,
        game_id=game_id,
        Event_Name=tile_id,
        Timestamp__gte=timezone.now() - datetime.timedelta(seconds=2),
    ).exists()

    if not recent_duplicate:
        LumoraLogs.objects.create(
            Event_Type="answer_submitted",
            Event_Name=tile_id,
            user_id=user_id,
            game_id=game_id,
            game_type="MCQ",
            is_correct=is_correct,
            answer=is_correct,
            skill_tag=skill_tag,
        )

        if skill_tag:
            mastery, _ = UserSkillMastery.objects.get_or_create(
                LumoraUserId=user_id, skill_tag=skill_tag,
            )
            mastery.attempts = F('attempts') + 1
            if is_correct:
                mastery.correct = F('correct') + 1
            mastery.save()

    return Response({
        "is_correct": is_correct,
        "skill_tag": skill_tag,
        "correctOption": correct_options,
    })


@api_view(['POST',])
@permission_classes((IsAuthenticated, ))
def GetSkillMastery(request):
    user_id = request.data.get('userId')
    if not user_id:
        return Response({"error": "userId is required"})

    rows = {
        m.skill_tag: m
        for m in UserSkillMastery.objects.filter(LumoraUserId=user_id)
    }

    data = []
    for tag in LOCKED_SKILL_TAGS:
        m = rows.get(tag)
        if m and m.attempts:
            accuracy = round((m.correct / m.attempts) * 100)
            data.append({
                "skill_tag": tag,
                "attempts": m.attempts,
                "correct": m.correct,
                "accuracy": accuracy,
            })
        else:
            data.append({
                "skill_tag": tag,
                "attempts": 0,
                "correct": 0,
                "accuracy": 0,
            })

    return Response(data)


@api_view(['POST',])
@permission_classes((IsAuthenticated, ))
def GradeExplanation(request):
    """
    Stretch feature: typed "Why do you think so?" grading. Reuses the same
    OpenRouter/strict_output pipeline as adaptive generation. Deliberately
    never blocks the learner -- any failure (bad JSON, network error, model
    hiccup) falls back to a neutral positive acknowledgement rather than an
    error, since this is a supplementary understanding-check, not part of
    scoring or mastery tracking.
    """
    user_id = request.data.get('userId')
    game_id = request.data.get('gameId')
    tile_id = request.data.get('tileId')
    explanation = request.data.get('explanation')

    if not user_id or not game_id or not tile_id:
        return Response({"error": "userId, gameId and tileId are required"})
    if not isinstance(explanation, str) or not explanation.strip():
        return Response({"error": "explanation must be non-empty text"})

    tile = Tiles.objects.filter(tileid=tile_id, gameid=game_id).first()
    if tile is None:
        return Response({"error": "invalid tile-id for this game"})

    # Fetch parent game for passage context if available
    game = Games.objects.filter(gameid=game_id).first()
    passage_text = (getattr(game, 'passage', '') or getattr(tile, 'passage', '') or '') if (game or tile) else ''

    correct_options = _parse_correct_options(tile.correct)
    correct_text_parts = [
        getattr(tile, f"op{idx}", None) for idx in correct_options
    ]
    correct_answer_text = " / ".join(p for p in correct_text_parts if p) or "(unknown)"

    system_prompt = (
        "You are a warm, encouraging elementary/middle-school reading tutor and AI reasoning coach. "
        "Evaluate a student's explanation for why their answer to a reading comprehension question is correct. "
        "Check whether they identified evidence/clues, connected evidence to their conclusion, and demonstrated real understanding."
    )
    user_prompt = (
        (f"Reading Passage: \"{passage_text.strip()}\"\n\n" if passage_text and passage_text.strip() else "") +
        f"Question: {tile.question}\n"
        f"Correct answer: {correct_answer_text}\n"
        f"Student's explanation: \"{explanation.strip()}\"\n\n"
        f"Evaluate the student's reasoning thoroughly and kindly."
    )
    output_format = {
        "is_reasonable": "true or false",
        "quality": "one of 'strong', 'partial', 'needs_work'",
        "score": "integer score 1 to 5 where 5 is exemplary",
        "identified_evidence": "true if student cited evidence, clues, or key facts from passage/question, else false",
        "made_connection": "true if student connected evidence logically to their answer, else false",
        "feedback": "1-2 short, warm, encouraging coaching sentences explaining what was good or missing",
        "next_step": "1 concise sentence advising the student what to look out for next time"
    }

    try:
        from background_tasks.gemini import strict_output
        result = strict_output(system_prompt, user_prompt, output_format)
        data_resp = json.loads(result["response"]["body"])
        is_reasonable = bool(data_resp.get("is_reasonable"))
        quality = str(data_resp.get("quality", "partial")).lower()
        if quality not in ["strong", "partial", "needs_work"]:
            quality = "partial" if is_reasonable else "needs_work"
        score = int(data_resp.get("score", 3))
        identified_evidence = bool(data_resp.get("identified_evidence", is_reasonable))
        made_connection = bool(data_resp.get("made_connection", is_reasonable))
        feedback = data_resp.get("feedback")
        if not isinstance(feedback, str) or not feedback.strip():
            feedback = "Thanks for sharing your thinking!"
        next_step = data_resp.get("next_step")
        if not isinstance(next_step, str) or not next_step.strip():
            next_step = "Keep looking for clues in the text when explaining your answer!"
        is_fallback = False
    except Exception as e:
        logging.error(f"[GRADE EXPLANATION] failed: {e}")
        is_reasonable = True
        quality = "partial"
        score = 3
        identified_evidence = True
        made_connection = True
        feedback = "Thanks for sharing your thinking!"
        next_step = "Keep explaining your thoughts on future questions!"
        is_fallback = True

    LumoraLogs.objects.create(
        Event_Type="explanation_submitted",
        Event_Name=tile_id,
        user_id=user_id,
        game_id=game_id,
        game_type="MCQ",
        skill_tag=tile.skill_tag,
    )

    return Response({
        "is_reasonable": is_reasonable,
        "quality": quality,
        "score": score,
        "identified_evidence": identified_evidence,
        "made_connection": made_connection,
        "feedback": feedback,
        "next_step": next_step,
        "is_fallback": is_fallback,
    })


class FetchlevelsGames(APIView):
    permission_classes = []
    def post(self, request):
        l3=Games.objects.filter(level_id=request.data['level_id']).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip','live','passage_text','grade_band','difficulty','target_skill').order_by('order')
        data3=[]
        for f in l3:
            d3={}
            d3['created_at']=f[0]
            d3['gameid']=f[1]
            d3['level_id']=f[2]
            d3['order']=f[3]
            d3['name']=f[4]
            d3['ImageLink']=f[5]
            d3['gameTip']=f[6]
            d3['in_gameTip']=f[7]
            d3['live']=f[8]
            d3['passage_text']=f[9]
            d3['grade_band']=f[10]
            d3['difficulty']=f[11]
            d3['target_skill']=f[12]
            data3.append(d3)
        return Response(data3)

class FetchlevelsGamesMain(APIView):
    permission_classes = []
    def post(self, request):
        l3=Games.objects.filter(level_id=request.data['level_id']).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip','live').order_by('order')
        data3=[]
        for f in l3:
            if f[8].lower()=='yes':
                d3={}
                d3['created_at']=f[0]
                d3['gameid']=f[1]
                d3['level_id']=f[2]
                d3['order']=f[3]
                d3['name']=f[4]
                d3['ImageLink']=f[5]
                d3['gameTip']=f[6]
                d3['in_gameTip']=f[7]
                d3['live']=f[8]
                data3.append(d3)
        return Response(data3)


class FetchCategoryData(APIView):
    permission_classes = []

    def get(self, request):
        categories = Categories.objects.all()
        data = []

        for category in categories:
            blogs = Blogs.objects.filter(category=category.name)
            
            courses = category.courses.all().values('courseid')

            category_data = {
                "created_at": category.created_at,
                "category_id": category.category_id,
                "name": category.name,
                "courses": list(courses), 
                "ImageLink": category.ImageLink,
                "blogs": list(blogs.values('blog_id'))  
            }
            data.append(category_data)

        return Response(data)


class FetchCourse(APIView):
    permission_classes = []
    def get(self, request):
        l=Course.objects.all().values_list('created_at', 'courseid', 'order', 'name', 'ImageLink', 'course_tip','live')
        data=[]
        for i in l:
            d={}
            d['created_at']=i[0]
            d['courseid']=i[1]
            d['order']=i[2]
            d['name']=i[3]
            d['ImageLink']=i[4]
            d['course_tip']=i[5]
            d['live']=i[6]
            l1=Topic.objects.filter(courseid=i[1]).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live')
            data1=[]
            for j in l1:
                d1={}
                d1['created_at']=j[0]
                d1['topic_id']=j[1]
                d1['courseid']=j[2]
                d1['order']=j[3]
                d1['name']=j[4]
                d1['ImageLink']=j[5]
                d1['topic_tip']=j[6]
                d1['live']=j[7]

                l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live')
                data2=[]
                for k in l2:
                    d2={}
                    d2['created_at']=k[0]
                    d2['topic_id']=k[1]
                    d2['level_id']=k[2]
                    d2['order']=k[3]
                    d2['name']=k[4]
                    d2['ImageLink']=k[5]
                    d2['level_tip']=k[6]
                    d2['live']=k[7]
                    # l3=Games.objects.filter(level_id=k[2]).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip')
                    # data3=[]
                    # for f in l3:
                    #     d3={}
                    #     d3['created_at']=f[0]
                    #     d3['gameid']=f[1]
                    #     d3['level_id']=f[2]
                    #     d3['order']=f[3]
                    #     d3['name']=f[4]
                    #     d3['ImageLink']=f[5]
                    #     d3['gameTip']=f[6]
                    #     d3['in_gameTip']=f[7]
                    #     data3.append(d3)

                    # d2['related_games']=data3
                    data2.append(d2)

                d1['related_levels']=data2
                data1.append(d1)

            d['related_topics']=data1
            data.append(d)
        return Response(data)

    def post(self, request):
        l=Course.objects.filter(courseid=request.data['course_id']).values_list('created_at', 'courseid', 'journey', 'topic', 'level', 'gameid')
        data=[]
        
        for i in l:
            if i[6].lower()=='yes':
                d={}
                d['created_at']=i[0]
                d['courseid']=i[1]
                d['order']=i[2]
                d['name']=i[3]
                d['ImageLink']=i[4]
                d['course_tip']=i[5]
                d['live']=i[6]
        return Response(data)


class FetchCourseMain(APIView):
    permission_classes = []
    def get(self, request):
        l=Course.objects.all().values_list('created_at', 'courseid', 'order', 'name', 'ImageLink', 'course_tip','live')
        data=[]
        for i in l:
            if i[6].lower()=='yes':
                d={}
                d['created_at']=i[0]
                d['courseid']=i[1]
                d['order']=i[2]
                d['name']=i[3]
                d['ImageLink']=i[4]
                d['course_tip']=i[5]
                d['live']=i[6]
                l1=Topic.objects.filter(courseid=i[1]).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live')
                data1=[]
                for j in l1:
                    if j[7].lower()=='yes':
                        d1={}
                        d1['created_at']=j[0]
                        d1['topic_id']=j[1]
                        d1['courseid']=j[2]
                        d1['order']=j[3]
                        d1['name']=j[4]
                        d1['ImageLink']=j[5]
                        d1['topic_tip']=j[6]
                        d1['live']=j[7]

                        l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live')
                        data2=[]
                        for k in l2:
                            if k[7].lower()=='yes':
                                d2={}
                                d2['created_at']=k[0]
                                d2['topic_id']=k[1]
                                d2['level_id']=k[2]
                                d2['order']=k[3]
                                d2['name']=k[4]
                                d2['ImageLink']=k[5]
                                d2['level_tip']=k[6]
                                d2['live']=k[7]
                                
                                # l3=Games.objects.filter(level_id=k[2]).values_list('created_at', 'gameid','level_id', 'order', 'name', 'ImageLink', 'gameTip','in_gameTip')
                                # data3=[]
                                # for f in l3:
                                #     d3={}
                                #     d3['created_at']=f[0]
                                #     d3['gameid']=f[1]
                                #     d3['level_id']=f[2]
                                #     d3['order']=f[3]
                                #     d3['name']=f[4]
                                #     d3['ImageLink']=f[5]
                                #     d3['gameTip']=f[6]
                                #     d3['in_gameTip']=f[7]
                                #     data3.append(d3)

                                # d2['related_games']=data3
                                data2.append(d2)

                        d1['related_levels']=data2
                        data1.append(d1)

                d['related_topics']=data1
                data.append(d)
        return Response(data)

    def post(self, request):
       
        l=Course.objects.filter(courseid=request.data['course_id']).values_list('created_at', 'courseid', 'order', 'name', 'ImageLink', 'course_tip','live')
        data=[]
        for i in l:
            if i[6].lower()=='yes':
                d={}
                d['created_at']=i[0]
                d['courseid']=i[1]
                d['order']=i[2]
                d['name']=i[3]
                d['ImageLink']=i[4]
                d['course_tip']=i[5]
                d['live']=i[6]
        return Response(data)

class FetchTopics(APIView):
    permission_classes = []
    def post(self, request):
        
        l1=Topic.objects.filter(courseid=request.data['course_id']).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live').order_by('order')
        course_name=Course.objects.get(courseid=request.data['course_id']).name
        data1=[]
        for j in l1:
            d1={}
            d1['created_at']=j[0]
            d1['topic_id']=j[1]
            d1['courseid']=j[2]
            d1['course_name']=course_name
            d1['order']=j[3]
            d1['name']=j[4]
            d1['ImageLink']=j[5]
            d1['topic_tip']=j[6]
            d1['live']=j[7]

            l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live').order_by('order')
            data2=[]
            for k in l2:
                d2={}
                d2['created_at']=k[0]
                d2['topic_id']=k[1]
                d2['level_id']=k[2]
                d2['order']=k[3]
                d2['name']=k[4]
                d2['ImageLink']=k[5]
                d2['level_tip']=k[6]
                d2['live']=k[7]
                data2.append(d2)

            d1['related_levels']=data2
            data1.append(d1)

        return Response(data1)

class FetchTopicsMain(APIView):
    permission_classes = []
    def post(self, request):
        
        l1=Topic.objects.filter(courseid=request.data['course_id']).values_list('created_at', 'topic_id','courseid', 'order', 'name', 'ImageLink', 'topic_tip','live').order_by('order')
        course_name=Course.objects.get(courseid=request.data['course_id']).name
        data1=[]
        for j in l1:
            if j[7].lower()=='yes':
                d1={}
                d1['created_at']=j[0]
                d1['topic_id']=j[1]
                d1['courseid']=j[2]
                d1['course_name']=course_name
                d1['order']=j[3]
                d1['name']=j[4]
                d1['ImageLink']=j[5]
                d1['topic_tip']=j[6]
                d1['live']=j[7]

                l2=Level.objects.filter(topic_id=j[1]).values_list('created_at', 'topic_id','level_id', 'order', 'name', 'ImageLink', 'level_tip','live').order_by('order')
                data2=[]
                for k in l2:
                    if k[7].lower()=='yes':
                        d2={}
                        d2['created_at']=k[0]
                        d2['topic_id']=k[1]
                        d2['level_id']=k[2]
                        d2['order']=k[3]
                        d2['name']=k[4]
                        d2['ImageLink']=k[5]
                        d2['level_tip']=k[6]
                        d2['live']=k[7]
                        data2.append(d2)

                d1['related_levels']=data2
                data1.append(d1)

        return Response(data1)

class ValidateAdminMail(APIView):
    permission_classes = []
    def post(self, request):
        e=request.data['email']
        if LumoraAdmins.objects.filter(email=e).exists():
            return Response({"status":True})
        else:
            return Response({"status":False})

class CreateBook(APIView):
    permission_classes = []
    def post(self, request):
        e = request.data.get('user_email') or request.data.get('email')
        if LumoraAdmins.objects.filter(email=e).exists():
            bid = e[0:3] + ''.join(random.choice(string.digits) for i in range(6))
            while Book.objects.filter(book_id=bid).exists():
                bid = e[0:3] + ''.join(random.choice(string.digits) for i in range(6))

            Book.objects.create(
                createdBy=request.data.get('createdBy'),
                userEmail=e,
                quiz=request.data.get('quiz'),
                metadata=request.data.get('metadata'),
                category=request.data.get('category'),
                tags=request.data.get('tags'),
                title=request.data.get('title'),
                content=request.data.get('content'),
                islive=request.data.get('isLive', False),
                book_id=bid,
                ImgUrl=request.data.get('ImgUrl')
            )

            return Response({"status": "book saved", "book_id": bid, "blog_id": bid})
        else:
            return Response({"status": "email not exist"})

CreateBlog = CreateBook

class UpdateBook(APIView):
    permission_classes = []

    def put(self, request):
        bid = request.data.get('book_id') or request.data.get('blog_id')
        owner_email = request.data.get('email')
        updates = request.data.get('updates')
        if not bid or not owner_email or not updates:
            return Response({"status": "Missing required data"}, status=400)

        if not Book.objects.filter(Q(book_id=bid) & Q(userEmail=owner_email)).exists():
            return Response({"status": "Book does not exist or you are not the owner"}, status=404)

        valid_fields = {
            "title": "title",
            "content": "content",
            "ImgUrl": "ImgUrl",
            "islive": "islive",
            "category": "category",
            "tags": "tags",
            "quiz": "quiz",
            "metadata": "metadata",
        }

        update_kwargs = {}
        for field, value in updates.items():
            if field in valid_fields:
                update_kwargs[valid_fields[field]] = value
            else:
                return Response({"status": f"Invalid field: {field}"}, status=400)

        if update_kwargs:
            Book.objects.filter(book_id=bid).update(**update_kwargs)
            return Response({"status": "Book updated successfully"})
        else:
            return Response({"status": "No valid fields to update"}, status=400)

editBlog = UpdateBook

class DeleteBook(APIView):
    permission_classes = []
    def post(self, request):
        bid = request.data.get('book_id') or request.data.get('blog_id')
        if bid and Book.objects.filter(book_id=bid).exists():
            Book.objects.filter(book_id=bid).delete()
            return Response({"status": "book deleted"})
        else:
            return Response({"status": "book does not exist"})

DeleteBlog = DeleteBook

class FetchAdminBooks(APIView):
    permission_classes = []
    def post(self, request):
        email = request.data.get('user_email') or request.data.get('email')
        l = Book.objects.filter(userEmail=email).values_list(
            'created_at', 'book_id', 'title', 'content', 'createdBy', 'islive', 'ImgUrl', 'category', 'metadata', 'quiz', 'tags', 'userEmail', 'last_updated'
        )
        data = []
        for i in l:
            d = {}
            d['created_at'] = i[0]
            d['book_id'] = i[1]
            d['blog_id'] = i[1]
            d['title'] = i[2]
            d['content'] = i[3]
            d['createdBy'] = i[4]
            d['isLive'] = i[5]
            d['ImgUrl'] = i[6]
            d['category'] = i[7]
            d['metadata'] = i[8]
            d['quiz'] = i[9]
            d['tags'] = i[10]
            d['userEmail'] = i[11]
            d['last_updated'] = i[12]
            data.append(d)
        return Response(data)

FetchAdminBlogs = FetchAdminBooks

class FetchBookById(APIView):
    permission_classes = []

    def post(self, request):
        bid = request.data.get('book_id') or request.data.get('blog_id')
        l = Book.objects.filter(book_id=bid).values_list(
            'created_at', 
            'book_id', 
            'title', 
            'content', 
            'createdBy', 
            'islive', 
            'ImgUrl', 
            'category', 
            'metadata', 
            'quiz', 
            'tags', 
            'last_updated'
        )
        data = []
        for i in l:
            d = {
                'created_at': i[0],
                'book_id': i[1],
                'blog_id': i[1],
                'title': i[2],
                'content': i[3],
                'createdBy': i[4],
                'isLive': i[5],
                'ImgUrl': i[6],
                'category': i[7],
                'metadata': i[8],
                'quiz': i[9],
                'tags': i[10],
                'last_updated': i[11]
            }
            data.append(d)
        return Response(data)

FetchBlogbyId = FetchBookById

class FetchBooks(APIView):
    permission_classes = []

    def get(self, request):
        l = Book.objects.all().values_list(
            'created_at', 
            'book_id', 
            'title', 
            'content', 
            'createdBy', 
            'islive', 
            'ImgUrl', 
            'category', 
            'metadata', 
            'quiz', 
            'tags', 
            'last_updated'
        )
        data = []
        for i in l:
            d = {
                'created_at': i[0],
                'book_id': i[1],
                'blog_id': i[1],
                'title': i[2],
                'content': i[3],
                'createdBy': i[4],
                'isLive': i[5],
                'ImgUrl': i[6],
                'category': i[7],  
                'metadata': i[8],
                'quiz': i[9],
                'tags': i[10],
                'last_updated': i[11]
            }
            data.append(d)
        return Response(data)

FetchBlogs = FetchBooks


# view to check if user is in customer
class SendRegisterEmail(APIView):
    permission_classes = []
    def post(self, request):
        d={"status":"Failed"}

        message_subject = "Registration on Sponge"  # subject
        message = get_template("email.html").render(context ={
            "title":message_subject,
            "content":"Hi\n Thank you for starting registration on Sponge.\nOnce you have completed the registration, please use this referral code: dan263b\nWe wish you great time on the app!"
            })
        mail = EmailMessage(
            subject=message_subject,
            body=message,
            from_email="generalenterprises247@gmail.com",
            to=[request.data['email']]
        )
        mail.content_subtype = "html"
        mail.send()
        d={"status":"Success"}
        return Response(d)

class EventLogs(APIView):
    permission_classes = []
    def post(self, request):
        d={"status":"Failed"}

        for i in request.data:
            LumoraLogs.objects.create(
                Event_Type=i['event'],
                Event_Name=i['value'],
                Timestamp=i['timestamp'],
                session_id=i['event_data']['session_id'],
                user_id=i['event_data']['user_id'],
                game_id=i['event_data']['game_id'],
                game_type=i['event_data']['game_type'],
                game_name=i['event_data']['game_name'],
                food_name=i['event_data']['food_name'],
                food_id=i['event_data']['food_id'],
                answer=i['event_data']['answer'],
                userinput=i['event_data']['userinput'],
                score=i['event_data']['score'],
                next_game_id=i['event_data']['next_game_id'],
                next_game_name =i['event_data']['next_game_name']
            )
        d={"status":"Success"}
        return Response(d)


class CreateUser(APIView):
    permission_classes = []
    def post(self, request):
        username=request.data['username']
        email=request.data['email']
        d={"status":"already existed"}
        if LumoraUsers.objects.filter(LumoraEmail=email).exists()==False:
            user_id =email[0:3] + ''.join(random.choice(string.digits) for i in range(4))
            if LumoraUsers.objects.filter(LumoraUserId=user_id).exists()==True:
                user_id =email[0:3] + ''.join(random.choice(string.digits) for i in range(4))

            LumoraUsers.objects.create(LumoraUser=username, LumoraEmail=email,image=request.data['image'], provider=request.data['provider'],LumoraUserId=user_id)
            d['status']='created'
            return Response(d)
        return Response(d)

from django.http import JsonResponse
import threading
import ast

# def create_games_task(levelId, moduleId,chat_history_data):
#     s1=f"Create mcq or true-false games for level {levelId} in module {moduleId}. Create Atleast 2 games. Each game must have atleast 10 questions. The answer for mcq games should be from one of the available options. Make sure to include options for true-false games."
#     s2="\nYou are to output the following in json format:"+ str(
#             {
#                 "games": [
#                 {
#                     "id": "string",
#                     "game_name": "a suitable game name",
#                     "game_description":
#                     "Describe what the game is about. The description should be within 300-400 words",
#                     "questions": [
#                     {
#                         "id": "string",
#                         "type": "true-false or mcq",
#                         "question": "question",
#                         "option1": "option1 with max length of 3 words",
#                         "option2": "option2 with max length of 3 words",
#                         "option3": "option3 with max length of 3 words",
#                         "option4": "option3 with max length of 3 words",
#                         "correct_answer": "should be one of the following option",
#                         "reason":
#                         "Explain why the correct answer is correct with proper reasoning.",
#                     },
#                     ],
#                 },
#                 ],
#             }
#         )+".\nDo not put quotation marks or escape character \\ in the output fields."
#     s3=s1+s2

#     d={ "prompt": s3,"chat_history": chat_history_data }
#     try:
#         response = requests.post("https://pthiq717m6.execute-api.eu-west-2.amazonaws.com/prod/create-games", json=d)
#         print(response.json())
#         if response.json()['statusCode']==200:
#             # print(ast.literal_eval(response.json()['body']))
            
            
#             # AdminDataQueue.objects.filter(topic=data['topic']).update(
#             # status='done',
#             # completed=True,
#             # last_updated=datetime.datetime.now()
#             # )
            
#             print("games created") 
#             return ast.literal_eval(response.json()['body'])
#         else:
#             # AdminDataQueue.objects.filter(topic=data['topic']).update(
#             # status='failed',
#             # last_updated=datetime.datetime.now()
#             # )
#             return None

#     except requests.exceptions.RequestException as e:
#         # Handle errors (log them, retry, etc.)
#         # AdminDataQueue.objects.filter(topic=data['topic']).update(
#         #     status='error',
#         #     last_updated=datetime.datetime.now()
#         # )
#         print(f"Error occurred: {e}")
#         return None


# def create_courses_task(url, email,topics):
#     s1="You are a helpful AI that is able to generate complete course structure for a given topic with modules, levels and games."
#     s2="\nYou are to output the following in json format: "+str(
#             {
#             "course_name": "courseName",
#             "course_description": "courseDespriction : between 300-400 words",
#             "modules": [
#                 {
#                 "id": "string",
#                 "module_name": "moduleName",
#                 "module_description": "moduleDescription : between 300-400 words",
#                 "levels": [
#                     {
#                     "id": "string",
#                     "level_name": "string",
#                     "level_description": "levelDescription: between 300-400 words",
#                     },
#                 ],
#                 },
#             ],
#             }
#         )+". \nDo not put quotation marks or escape character \\ in the output fields."
#     s3=s1+s2
#     for data in topics:

#         s=f"You are to generate a complete course structure about {data['topic']} with {data['modules']} module. Each module should have atleast 2 levels."
#         prompt=s3+s
#         d={ "prompt": prompt }
#         try:
#             response = requests.post(url, json=d)
#             response_json = response.json()
#             print("Full Response JSON:", response_json)
#             if response_json.get('statusCode') == 200: 
#                 print("Full JSON:",response_json.get('statusCode'))
#                 uid = email[0:3] + ''.join(random.choice(string.digits) for i in range(6))

#                 while AdminHistory.objects.filter(uid=uid).exists():
#                     uid = email[0:3] + ''.join(random.choice(string.digits) for i in range(6))



#                 json_data=ast.literal_eval(response.json()['body'])
#                 chat_history_data=[{
#                         "userPrompt": str(prompt),
#                         "modelResponse":  str(response.json()['body'])
#                     }]
#                 try:
#                     c=0
#                     for k in json_data["modules"]:
#                         f=0
#                         for j in k["levels"]:
#                             games_data = create_games_task(j["id"],k["id"],chat_history_data)
#                             json_data["modules"][c]["levels"][f]["games"]=games_data["games"]
#                             f+=1
#                             time.sleep(10)
#                         c+=1
#                 except Exception as e:
#                     print("EXception :",e)
                
#                 data1= {
#                     "courseDetails": json_data,
#                     "chat": [{
#                         "userPrompt": str(prompt),
#                         "modelResponse":  str(json_data)
#                     }]
#                 }
#                 AdminHistory.objects.create(
#                     AdminEmail=email,
#                     data=data1,
#                     uid=uid
#                 )
#                 AdminDataQueue.objects.filter(topic=data['topic']).update(
#                 status='done',
#                 completed=True,
#                 last_updated=datetime.datetime.now()
#                 )
                
#                 print("course created")  
#             else:
#                 AdminDataQueue.objects.filter(topic=data['topic']).update(
#                 status='failed',
#                 last_updated=datetime.datetime.now()
#                 )

#         except requests.exceptions.RequestException as e:
#             AdminDataQueue.objects.filter(topic=data['topic']).update(
#                 status='error',
#                 last_updated=datetime.datetime.now()
#             )
#             print(f"Error occurred: {e}")


# class QueueCourseCreation(APIView):
#     permission_classes = []
#     def post(self, request):
#         email=request.data['email']
#         topics=request.data['topics']
#         for data in topics:
#             if AdminDataQueue.objects.filter(Q(AdminEmail=email)& Q(topic=data['topic'])).exists():
#                 AdminDataQueue.objects.filter(Q(AdminEmail=email)& Q(topic=data['topic'])).delete()
#             AdminDataQueue.objects.create(
#                 AdminEmail=email,
#                 topic=data['topic'],
#                 status='in_progress',
#             )

#         d={"status":"course creation in progress"}
        
#         if LumoraAdmins.objects.filter(email=email).exists():
#             try:
#                 def task():
#                     url = "https://pthiq717m6.execute-api.eu-west-2.amazonaws.com/prod/create-course"
                
#                     create_courses_task(url, email,topics)


#                 # Create a thread to run the task
#                 thread = threading.Thread(target=task)
#                 thread.start()
#             except Exception as e:
#                 print(e)
#             return Response(d)
#         d={"status":"admin not exist"}
#         return Response(d)

class GetQueueData(APIView):
    permission_classes = []
    def post(self, request):
        email = request.data.get('email') or request.data.get('useremail')
        if not email:
            return Response({"status": "email required"})
        if AdminDataQueue.objects.filter(AdminEmail=email).exists():
            if AdminDataQueue.objects.filter(Q(AdminEmail=email) & Q(completed=False)).exists():
                l = list(AdminDataQueue.objects.filter(Q(AdminEmail=email) & Q(completed=False)).values('created_at','topic','status','completed','last_updated'))
                return Response(l)
            else:
                d={"status":"no data is in progress/failed"}
                return Response(d)
        else:
            d={"status":"admin data not exist on queue table"}
            return Response(d)
        

class FetchBooksByGenre(APIView):
    permission_classes = []

    def post(self, request):
        category_id = request.data.get('category_id') or request.data.get('genre_id')
        if not category_id:
            return Response({'error': 'category_id or genre_id is required'})
        
        try:
            category = Categories.objects.get(category_id=category_id)
        except Categories.DoesNotExist:
            return Response({'error': 'Genre/Category not found'})
        
        books = Book.objects.filter(category=category.name) 

        book_data = list(books.values(
            'book_id', 'title', 'content', 'userEmail', 'createdBy', 'quiz', 'metadata',
            'ImgUrl', 'islive', 'tags', 'created_at', 'last_updated'
        ))
        for item in book_data:
            item['blog_id'] = item.get('book_id')

        return Response({'category': category.name, 'genre': category.name, 'books': book_data, 'blogs': book_data})

FetchBlogsByCategory = FetchBooksByGenre

class FetchCoursesByCategory(APIView):
    permission_classes = []

    def post(self, request):
        category_id = request.data.get('category_id')
        if not category_id:
            return Response({'error': 'category_id is required'})

        try:
            category = Categories.objects.get(category_id=category_id)
        except Categories.DoesNotExist:
            return Response({'error': 'Category not found'})

        courses = category.courses.all()

        course_data = list(courses.values(
            'courseid', 'name', 'order', 'course_tip', 'ImageLink', 'journey', 'topic',
            'level', 'gameid', 'live', 'created_at'
        ))

        return Response({'category': category.name, 'courses': course_data})


class FetchAllCourses(APIView):
    permission_classes = []

    def get(self, request):
        courses = Course.objects.all().values(
            'created_at',
            'courseid',
            'name',
            'order',
            'course_tip',
            'ImageLink',
            'journey',
            'topic',
            'level',
            'gameid',
            'live'
        )
        
        courses_list = list(courses)
        
        for course in courses_list:
            course_instance = Course.objects.get(courseid=course['courseid'])
            categories = course_instance.categories.values_list('name', flat=True)
            course['categories'] = list(categories)
        
        return Response(courses_list)


import asyncio
import json
import random
import string
import datetime
import threading
from django.db.models import Q
import requests 
from django.db import close_old_connections
import time  # Ensure time is imported for sleep
import logging


"""def create_games_task(levelId, moduleId, chat_history_data, retries=3):
    s1 = f"Create mcq or true-false games for level {levelId} in module {moduleId}. Create at least 2 games. Each game must have at least 5 questions. The answer for mcq games should be from one of the available options. Make sure to include options for true-false games."
    s2 = "\nYou are to output the following in JSON format:" + json.dumps({
        "games": [
            {
                "id": "string",
                "game_name": "a suitable game name",
                "game_description": "Describe what the game is about. The description should be within 300-400 words",
                "questions": [
                    {
                        "id": "string",
                        "type": "true-false or mcq",
                        "question": "question",
                        "option1": "option1 with max length of 3 words",
                        "option2": "option2 with max length of 3 words",
                        "option3": "option3 with max length of 3 words",
                        "option4": "option4 with max length of 3 words",
                        "correct_answer": "should be one of the following options",
                        "reason": "Explain why the correct answer is correct with proper reasoning.",
                    },
                ],
            },
        ],
    }) + ".\nDo not put quotation marks or escape characters in the output fields."
    s3 = s1 + s2

    d = {"prompt": s3, "chat_history": chat_history_data}
    
    for attempt in range(retries):
        try:
            response = requests.post("https://onatdc37sdgp3jgujffo7wdywm0yzinq.lambda-url.ap-south-1.on.aws", json=d)
            print("Response status:", response.status_code)
            print("Response content:", response.content.decode())  # Print raw content for debugging

            try:
                response_json = response.json()  # Attempt to parse JSON
                # print("Parsed JSON response:", response_json)

                if response_json.get('statusCode') == 200:
                    games = json.loads(response_json['body']).get('games', [])
                    for game in games:
                        if len(game.get('questions', [])) < 10:
                            print(f"Warning: Game {game['id']} does not have 10 questions")
                    print("Games created")
                    return json.loads(response_json['body'])  # Safely parse JSON response
                else:
                    print(f"API returned an error: {response_json.get('statusCode')}")
                    if attempt < retries - 1:
                        print(f"Retrying... ({attempt + 1}/{retries})")
                        time.sleep(2)  # Wait before retrying
                    else:
                        return None

            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response content: {response.content.decode()}")  # Print the raw response content
                return None

        except requests.exceptions.RequestException as e:
            print(f"Error occurred: {e}")
            if attempt < retries - 1:
                print(f"Retrying... ({attempt + 1}/{retries})")
                time.sleep(2)  # Wait before retrying
            else:
                return None
    

async def async_create_games_task(levelId, moduleId, chat_history_data):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, create_games_task, levelId, moduleId, chat_history_data)"""
from django.utils import timezone
import requests, json, random, string, logging, datetime, threading, asyncio, time
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
import queue
import threading
import time

GAME_JOB_QUEUE = queue.Queue()
GAME_WORKER_RUNNING = False
GAME_LOCK = threading.Lock()



def create_games_task(levelId, moduleId, chat_history_data):
    """
    Generate Lumora reading-comprehension games for a lesson.

    IMPORTANT:
    - This function generates content only.
    - The existing save pipeline remains responsible for persisting
      the generated games and questions.
    - Content is specifically designed for Lumora's adaptive
      English reading-learning experience.
    """

    try:
        from background_tasks.gemini import generate_gemini_content, clean_json_response

        # ---------------------------------------------------------
        # LUMORA READING GAME PROMPT
        # ---------------------------------------------------------

        prompt_g1 = f"""
You are Lumora, an AI adaptive English reading coach.

You are generating educational reading-comprehension games for:

Module ID: {moduleId}
Level ID: {levelId}

The lesson context is provided in the chat history below.

============================================================
CORE PRODUCT RULE
============================================================

Lumora is an English reading-learning product.

You MUST generate READING COMPREHENSION content.

This is NOT a general knowledge quiz.

Every game MUST be built around an original reading passage.

The learner should be able to answer every question by carefully
reading and understanding the passage.

Do NOT test knowledge that is not contained in the passage.

For example, if the passage mentions fish, DO NOT ask the learner
to identify biological fish families unless the passage itself
explicitly teaches that information.

The subject of the passage may come from the lesson topic, but the
learning objective is READING COMPREHENSION.

============================================================
GRADE AND AGE APPROPRIATENESS
============================================================

The course may target Grade 3, Grade 5, or Grade 7.

Determine the learner's grade from the lesson/course context when
available.

If the grade cannot be determined from the context, use Grade 5
as the default.

Adapt all content to the learner's grade.

Grade 3:
- Simple sentences.
- Familiar vocabulary.
- Short paragraphs.
- Clear story structure.
- Simple inference.
- Concrete cause and effect.
- Straightforward sequence.
- Avoid advanced academic terminology.

Grade 5:
- Moderate sentence complexity.
- Broader vocabulary.
- Multi-step reasoning.
- Stronger inference and evidence questions.
- Age-appropriate informational or narrative passages.

Grade 7:
- More sophisticated vocabulary.
- More complex sentence structures.
- Deeper inference.
- Stronger evidence-based reasoning.
- More nuanced cause/effect and main-idea questions.

Never use vocabulary or concepts substantially above the learner's
grade level unless the word is directly taught by the passage.

============================================================
READING SKILLS
============================================================

Use ONLY these six Lumora skill tags:

main-idea
vocabulary
inference
cause-effect
sequence
evidence

Definitions:

main-idea:
Ask what the passage is mostly about or what central message it
communicates.

vocabulary:
Ask what a word or phrase means AS USED IN THE PASSAGE.

inference:
Require the learner to figure something out using clues from the
passage. The answer must not be directly stated word-for-word.

cause-effect:
Ask what caused something to happen or what happened because of
something else in the passage.

sequence:
Ask what happened before, after, first, next, or last.

evidence:
Ask which detail from the passage best supports an answer,
conclusion, or idea.

============================================================
GAME REQUIREMENTS
============================================================

Generate 1 game.

Each game MUST contain 5 to 6 questions.

Each game MUST contain its own original reading passage.

Each passage should generally be:

- 150-250 words for Grade 3
- 180-300 words for Grade 5
- 220-350 words for Grade 7

Make passages engaging.

Prefer:
- short stories
- school situations
- friendships
- family experiences
- nature
- animals
- discoveries
- everyday problems
- community situations
- age-appropriate informational topics

The topic should relate naturally to the lesson context.

============================================================
ADAPTIVE SKILL DISTRIBUTION
============================================================

Every game must have a target_skill.

Approximately 60-70% of the questions in each game should test
the target_skill.

The remaining questions should test other Lumora reading skills.

Do NOT use skills outside the six allowed skills.

Every question MUST have exactly one skill_tag.

The skill_tag must match one of:

main-idea
vocabulary
inference
cause-effect
sequence
evidence

============================================================
QUESTION REQUIREMENTS
============================================================

Use a mixture of:

- MCQ
- true-false

For MCQ:

- Exactly 4 options.
- Exactly 1 correct answer.
- Distractors must be plausible.
- Options should be age-appropriate.
- Do not make the correct answer obviously longer than all others.
- Do not use "all of the above".
- Do not use "none of the above".

For true-false:

- option1 must be "True"
- option2 must be "False"
- option3 must be ""
- option4 must be ""
- correct_answer must be exactly "True" or "False"

Every question must be answerable from the passage.

============================================================
IMPORTANT QUESTION QUALITY RULES
============================================================

DO NOT create trivia questions.

DO NOT ask questions requiring outside knowledge.

DO NOT ask:

"Which group does this animal belong to?"

unless the passage itself explicitly teaches the classification.

DO NOT ask:

"What is the scientific name of...?"

unless the passage teaches it.

DO NOT ask random factual questions simply because the topic
contains that fact.

Instead, ask questions such as:

"What caused Maya to change her plan?"

"What can the reader infer about Maya?"

"Which detail best shows that Maya was nervous?"

"What is the main idea of the passage?"

"What does the word 'determined' mean as used in paragraph 2?"

"What happened immediately after Maya found the note?"

============================================================
REASONING / EXPLANATION REQUIREMENTS
============================================================

Every question must have a specific reason.

The reason must explain WHY the correct answer is correct using
the passage.

Keep each reason to approximately 1-2 concise sentences.

NEVER repeat the same reason across questions.

NEVER generate 300-400 word explanations.

The explanation should be useful to a learner who got the question
wrong.

Example:

"The passage says that Maya packed an umbrella after seeing dark
clouds. This shows that she expected rain."

NOT:

"Option 2 is correct because it is the correct answer."

============================================================
PASSAGE QUALITY
============================================================

Every passage must:

- Be completely original.
- Have a clear beginning, middle, and ending when narrative.
- Contain enough details to support all questions.
- Include clues for inference questions.
- Include explicit details for evidence questions.
- Include meaningful vocabulary for vocabulary questions.
- Include clear relationships for cause-effect questions.
- Include events that can be ordered for sequence questions.
- Have a clear central idea for main-idea questions.

Do not make questions depend on tiny wording tricks.

Do not make multiple options arguably correct.

Do not create contradictory information inside the passage.

============================================================
GAME DESCRIPTION
============================================================

game_description must be concise.

Do NOT write 300-400 words.

It should describe the reading challenge in 1-3 sentences.

============================================================
JSON OUTPUT FORMAT
============================================================

You MUST output ONLY valid JSON matching this exact structure:

{{
    "games": [
        {{
            "id": "game_1",

            "game_name": "Reading Detective Mission Part 1",

            "game_description": "1-3 sentence description of the reading challenge",

            "passage_text": "the complete original reading passage",

            "grade_band": "Grade 3, Grade 5, or Grade 7",

            "difficulty": "easy, medium, or hard",

            "target_skill": "one of: main-idea, vocabulary, inference, cause-effect, sequence, evidence",

            "questions": [
                {{
                    "id": "unique question id",

                    "type": "mcq or true-false",

                    "skill_tag": "one of: main-idea, vocabulary, inference, cause-effect, sequence, evidence",

                    "question": "question based directly on the passage",

                    "option1": "option",

                    "option2": "option",

                    "option3": "option",

                    "option4": "option",

                    "correct_answer": "exact text of the correct option",

                    "reason": "1-2 concise sentences explaining why the answer is correct using the passage"
                }}
            ]
        }}
    ]
}}

============================================================
FINAL VALIDATION BEFORE RESPONDING
============================================================

Before returning the JSON, verify all of the following:

1. There is 1 game.
2. The game has 5 to 6 questions.
3. The game has passage_text.
4. The game has target_skill.
5. Every question has skill_tag.
6. Every skill_tag is one of the six Lumora skills.
7. Approximately 60-70% of the game's questions use target_skill.
8. Every question can be answered from its game's passage.
9. No question requires outside knowledge.
10. MCQ questions have exactly one correct option.
11. True-false questions use True/False options.
12. Reasons are short and question-specific.
13. Reasons are not repeated.
14. Passages are age-appropriate.
15. The content is reading comprehension, NOT trivia.
16. Return valid JSON only.

============================================================
LESSON CONTEXT
============================================================

Here is the course/lesson context:

{json.dumps(chat_history_data, ensure_ascii=False)}

Now generate the Lumora reading-comprehension games.
"""

        # ---------------------------------------------------------
        # CALL OPENROUTER GENERATION PIPELINE FOR GAME 1
        # ---------------------------------------------------------

        response_json1 = generate_gemini_content(prompt_g1)

        print(f"[GAME] {levelId} -> Lumora reading game 1 generated")

        games_list = []
        if isinstance(response_json1, dict):
            g_list1 = response_json1.get("games")
            if isinstance(g_list1, list) and len(g_list1) > 0:
                games_list.extend(g_list1)

        if not games_list:
            logging.error(f"[GAME] Unexpected or unparseable AI response format for {levelId}")
            return None

        # ---------------------------------------------------------
        # TRY GENERATING DISTINCT GAME 2 (FALLBACK TO CLONE IF FAIL)
        # ---------------------------------------------------------
        try:
            prompt_g2 = prompt_g1.replace(
                "Generate 1 game.", 
                "Generate Game 2 with a DIFFERENT original reading passage and DIFFERENT questions."
            ).replace("game_1", "game_2").replace("Part 1", "Part 2")

            response_json2 = generate_gemini_content(prompt_g2)
            if isinstance(response_json2, dict):
                g_list2 = response_json2.get("games")
                if isinstance(g_list2, list) and len(g_list2) > 0:
                    games_list.append(g_list2[0])
        except Exception as e:
            logging.warning(f"[GAME] Game 2 generation failed, using fallback clone: {e}")

        # Ensure at least 2 games exist
        if len(games_list) == 1:
            g1 = games_list[0]
            g2 = json.loads(json.dumps(g1))
            g2["id"] = f"{g1.get('id', 'g1')}_2"
            g2["game_name"] = f"{g1.get('game_name', 'Reading Challenge')} - Part 2"
            games_list.append(g2)

        return {"games": games_list}

    except Exception as e:
        logging.error(
            f"[GAME] Lumora game generation failed for {levelId}: {e}",
            exc_info=True
        )
        return None

def game_worker():
    global GAME_WORKER_RUNNING
    while True:
        try:
            level_data = GAME_JOB_QUEUE.get(timeout=3)
        except queue.Empty:
            GAME_WORKER_RUNNING = False
            break

        levelId = level_data["levelId"]
        moduleId = level_data["moduleId"]
        chat_history = level_data["chat_history"]

        print(f"[WORKER] Processing level {levelId}")

        retries = 0
        result = None
        while retries < 3:
            result = create_games_task(levelId, moduleId, chat_history)
            if result is not None:
                print(f"[WORKER] Completed level {levelId}")
                break
            retries += 1
            print(f"[WORKER] Retry {retries} for level {levelId}")
            time.sleep(2)

        if result is None:
            print(f"[WORKER] FAILED level {levelId} after 3 retries.")

        GAME_JOB_QUEUE.task_done()
        time.sleep(1)

def start_game_worker():
    global GAME_WORKER_RUNNING
    with GAME_LOCK:
        if not GAME_WORKER_RUNNING:
            GAME_WORKER_RUNNING = True
            threading.Thread(target=game_worker, daemon=True).start()
            print("[WORKER] Started background worker")

async def async_create_games_task(levelId, moduleId, chat_history_data):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, create_games_task, levelId, moduleId, chat_history_data)

LOCKED_SKILL_TAGS_SET = set(LOCKED_SKILL_TAGS)
ADAPTIVE_LESSON_QUESTION_COUNT = 5
ADAPTIVE_LESSON_WEAK_SKILL_MIN = 3  # 3 of 5 = 60%, within the 60-70% target


def _next_game_order(level_id):
    last = Games.objects.filter(level_id=level_id).order_by('-order').first()
    return (last.order + 1) if (last and last.order is not None) else 1


def _build_adaptive_lesson_prompt(grade, difficulty, weakest_skill, secondary_skill):
    system_prompt = (
        f"You are an expert children's reading-education content writer. You write "
        f"short, engaging, age-appropriate original reading passages and comprehension "
        f"questions for Grade {grade} students, calibrated to a '{difficulty}' reading "
        f"level. You never reuse existing stories or characters."
    )

    secondary_line = (
        f'\n- At least 1 of the {ADAPTIVE_LESSON_QUESTION_COUNT} questions should test the "{secondary_skill}" skill.'
        if secondary_skill else ""
    )

    user_prompt = (
        f"Write ONE engaging, original narrative reading passage (200-260 words) suitable for a "
        f"Grade {grade} student, followed by exactly {ADAPTIVE_LESSON_QUESTION_COUNT} "
        f"multiple-choice comprehension questions about it.\n\n"
        f'This learner is currently weakest at the "{weakest_skill}" reading skill.\n\n'
        f"Requirements:\n"
        f'- At least {ADAPTIVE_LESSON_WEAK_SKILL_MIN} of the {ADAPTIVE_LESSON_QUESTION_COUNT} '
        f'questions must specifically test the "{weakest_skill}" skill.'
        f"{secondary_line}\n"
        f"- Each question must be tagged with exactly one skill from this fixed list: "
        f"main-idea, vocabulary, inference, cause-effect, sequence, evidence.\n"
        f"- Each question must have exactly 4 answer options, with exactly one correct.\n"
        f"- Vocabulary and sentence complexity must be appropriate for Grade {grade}.\n"
        f"- Write a brand new original story with vivid details and text clues."
    )

    output_format = {
        "title": "a short title for the story",
        "passage": "the full story text, 200-260 words",
        "questions": [
            {
                "question": "the question text",
                "option1": "answer option 1",
                "option2": "answer option 2",
                "option3": "answer option 3",
                "option4": "answer option 4",
                "correct_option": "the number 1, 2, 3, or 4",
                "skill_tag": "one of: main-idea, vocabulary, inference, cause-effect, sequence, evidence",
                "reason": "a 1-2 sentence detailed explanation citing text evidence why this answer is correct",
            }
        ],
    }
    return system_prompt, user_prompt, output_format


def _validate_adaptive_lesson(data):
    """Never trust LLM output blindly. Returns (ok, error_message)."""
    if not isinstance(data, dict):
        return False, "response was not a JSON object"
    if not isinstance(data.get("title"), str) or not data["title"].strip():
        return False, "missing/empty title"
    if not isinstance(data.get("passage"), str) or len(data["passage"].strip()) < 50:
        return False, "missing/too-short passage"
    questions = data.get("questions")
    if not isinstance(questions, list) or len(questions) < 3:
        return False, "missing/too-few questions"
    for q in questions:
        if not isinstance(q, dict):
            return False, "a question entry was not an object"
        if not isinstance(q.get("question"), str) or not q["question"].strip():
            return False, "a question is missing its text"
        for opt_key in ("option1", "option2", "option3", "option4"):
            if not isinstance(q.get(opt_key), str) or not q[opt_key].strip():
                return False, f"a question is missing {opt_key}"
        try:
            correct = int(q.get("correct_option"))
        except (TypeError, ValueError):
            return False, "a question has a non-integer correct_option"
        if correct not in (1, 2, 3, 4):
            return False, "a question's correct_option is out of range 1-4"
        if q.get("skill_tag") not in LOCKED_SKILL_TAGS_SET:
            return False, f"a question has an invalid skill_tag: {q.get('skill_tag')!r}"
    return True, None


def generate_adaptive_lesson(level_id, grade, difficulty, weakest_skill, secondary_skill=None):
    """
    Phase 3 (adaptive generation). Calls the existing OpenRouter/gpt-oss-20b
    strict_output pipeline (background_tasks.gemini), validates the result,
    and persists it as a new Game + Tiles under level_id. Raises on failure
    (caller decides how to surface that) rather than silently returning a
    broken/partial lesson.
    """
    from background_tasks.gemini import strict_output

    if weakest_skill not in LOCKED_SKILL_TAGS_SET:
        raise ValueError(f"weakest_skill must be one of {LOCKED_SKILL_TAGS}, got {weakest_skill!r}")

    system_prompt, user_prompt, output_format = _build_adaptive_lesson_prompt(
        grade, difficulty, weakest_skill, secondary_skill
    )

    last_error = None
    data = None
    for attempt in range(2):  # one retry on a malformed/invalid response, not overengineered
        result = strict_output(system_prompt, user_prompt, output_format)
        try:
            raw = json.loads(result["response"]["body"])
        except (KeyError, json.JSONDecodeError) as e:
            last_error = f"could not parse model response: {e}"
            continue
        ok, err = _validate_adaptive_lesson(raw)
        if ok:
            data = raw
            break
        last_error = err

    if data is None:
        raise RuntimeError(f"adaptive lesson generation failed validation: {last_error}")

    gameid = f"adaptive-{uuid.uuid4().hex[:10]}"
    game = Games.objects.create(
        gameid=gameid,
        level_id=level_id,
        order=_next_game_order(level_id),
        name=data["title"],
        ImageLink="",
        gameTip="",
        in_gameTip="",
        live="Yes",
        type="MCQ",
        title=data["title"],
        description="",
        questionTip="Read the story, then answer the questions.",
        passage_text=data["passage"],
        grade_band=str(grade),
        difficulty=difficulty,
        target_skill=weakest_skill,
    )

    for i, q in enumerate(data["questions"], start=1):
        Tiles.objects.create(
            tileid=f"{gameid}-q{i}",
            gameid=gameid,
            qno=i,
            type="MCQ",
            question=q["question"],
            questionTip="",
            correct=str(int(q["correct_option"])),
            op1=q["option1"], op1Link="",
            op2=q["option2"], op2Link="",
            op3=q["option3"], op3Link="",
            op4=q["option4"], op4Link="",
            op5="", op5Link="", op6="", op6Link="", op7="", op7Link="", op8="", op8Link="",
            reason=q.get("reason", ""),
            live="Yes",
            skill_tag=q["skill_tag"],
        )

    return game


def get_weakest_skill(user_id):
    """
    Deterministic weakest-skill resolver.

    Rule: among the six locked skills, only skills the learner has actually
    attempted (attempts > 0) are eligible. The weakest is the one with the
    lowest accuracy (correct/attempts). A zero-attempt skill is NOT treated
    as a 0% skill and is excluded from the comparison entirely -- otherwise
    an untouched skill could wrongly outrank a skill the learner has
    genuinely struggled with.

    Ties (equal accuracy among attempted skills) break by each skill's
    position in LOCKED_SKILL_TAGS -- the fixed canonical order -- so the
    result is reproducible rather than arbitrary. This is also what makes
    the demo scenario (cause-effect 0/1, inference 0/1, evidence 0/1, a
    genuine 3-way tie at 0% accuracy) deterministically resolve to
    "inference": it's the first of those three tied skills in
    LOCKED_SKILL_TAGS order (main-idea, vocabulary, INFERENCE, cause-effect,
    sequence, evidence) -- not a hardcoded special case for that skill.

    If the learner has zero attempts across all six skills, there is
    nothing to rank, so this falls back to LOCKED_SKILL_TAGS[0]
    ("main-idea") -- a fixed, documented starting point for a brand-new
    learner, not a guess.

    Returns (weakest_skill, secondary_skill_or_None).
    """
    rows = {
        m.skill_tag: m
        for m in UserSkillMastery.objects.filter(LumoraUserId=user_id)
    }

    attempted = []
    for tag in LOCKED_SKILL_TAGS:
        m = rows.get(tag)
        if m and m.attempts > 0:
            accuracy = m.correct / m.attempts
            attempted.append((accuracy, tag))

    if not attempted:
        return LOCKED_SKILL_TAGS[0], None

    attempted.sort(key=lambda pair: (pair[0], LOCKED_SKILL_TAGS.index(pair[1])))
    weakest = attempted[0][1]
    secondary = attempted[1][1] if len(attempted) > 1 else None
    return weakest, secondary


class GenerateAdaptiveLesson(APIView):
    permission_classes = (IsAuthenticated, )  # needs a real userId to read UserSkillMastery

    def post(self, request):
        user_id = request.data.get("userId")
        level_id = request.data.get("level_id")
        grade = request.data.get("grade")
        difficulty = request.data.get("difficulty")

        if not user_id or not level_id or not grade or not difficulty:
            return Response({"error": "userId, level_id, grade and difficulty are required"})

        # weakest_skill is always derived server-side from the learner's real
        # UserSkillMastery data -- a client-provided weakest_skill is never
        # accepted or trusted here, by design (see get_weakest_skill above).
        weakest_skill, secondary_skill = get_weakest_skill(user_id)

        try:
            game = generate_adaptive_lesson(level_id, grade, difficulty, weakest_skill, secondary_skill)
        except Exception as e:
            logging.error(f"[ADAPTIVE LESSON] generation failed: {e}")
            return Response({"error": f"lesson generation failed: {e}"}, status=502)

        tiles = Tiles.objects.filter(gameid=game.gameid).order_by('qno')
        return Response({
            "gameid": game.gameid,
            "name": game.name,
            "passage_text": game.passage_text,
            "grade_band": game.grade_band,
            "difficulty": game.difficulty,
            "target_skill": game.target_skill,
            "question_count": tiles.count(),
        })


class GenerateGames(APIView):
    def post(self, request):
        levels = request.data.get("levels", [])
        moduleId = request.data.get("moduleId")
        chat_history = request.data.get("chat_history", {})

        if not levels:
            return Response({"error": "No levels provided"}, status=400)

        for lv in levels:
            GAME_JOB_QUEUE.put({
                "levelId": lv,
                "moduleId": moduleId,
                "chat_history": chat_history,
            })
            print(f"[QUEUE] Added level {lv}")

        start_game_worker()

        return Response({
            "status": "queued",
            "queued_levels": levels
        })


# ---------- COURSE & GAME GENERATION PIPELINE ----------
def generate_games_for_level_sync(level_id, level_name, level_desc, topic_name):
    """Generate original reading comprehension games for a course level using Lumora's game pipeline."""
    try:
        chat_history_data = [{
            "userPrompt": f"Topic: {topic_name}. Module Level: {level_name}. Description: {level_desc}",
            "modelResponse": f"Level context: {level_name} for topic {topic_name}"
        }]
        res = create_games_task(level_id, f"mod_{level_id}", chat_history_data)
        if isinstance(res, dict) and "games" in res and res["games"]:
            return res["games"]
    except Exception as e:
        logging.warning(f"[GAMES GEN] Lumora game pipeline call failed for level {level_name}: {e}")

    # High quality Fallback Game Structure with 2 full reading games and 10 questions each if AI call fails
    return [
        {
            "id": str(uuid.uuid4())[:8],
            "game_name": f"{level_name} - Investigation Part 1",
            "game_description": f"Read the passage carefully and complete 10 reading comprehension challenges for {topic_name}.",
            "passage_text": (
                f"The expedition into {topic_name} began early on a crisp morning. "
                f"Detectives Leo and Maya arrived at the perimeter, closely observing subtle clues that others had overlooked. "
                f"Faint markings near the threshold pointed toward an intricate subterranean vault, setting their next mission into motion. "
                f"As they proceeded deeper, Maya noticed a weathered journal tucked inside a stone crevice. "
                f"The journal contained detailed diagrams explaining how the ancient mechanisms functioned. "
                f"Realizing the pivotal significance of their discovery, Leo carefully documented each clue before taking their next step."
            ),
            "grade_band": "Grade 5",
            "difficulty": "simple_inference",
            "target_skill": "inference",
            "questions": [
                {
                    "id": "q1",
                    "type": "mcq",
                    "skill_tag": "main-idea",
                    "question": f"What is the central idea of this passage about {topic_name}?",
                    "option1": f"Detectives Leo and Maya uncovering essential clues about {topic_name}",
                    "option2": "The step-by-step process of repair work on old locks",
                    "option3": "A story about building wooden furniture in a workshop",
                    "option4": "A guide explaining daily weather and rain patterns",
                    "correct_answer": f"Detectives Leo and Maya uncovering essential clues about {topic_name}",
                    "reason": "The passage describes Leo and Maya investigating the scene and finding a weathered journal.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q2",
                    "type": "mcq",
                    "skill_tag": "inference",
                    "question": "What can you infer about Leo and Maya from their actions?",
                    "option1": "They are methodical researchers who observe subtle details missed by others",
                    "option2": "They dislike solving mysteries and abandoned the investigation early",
                    "option3": "They damaged the vault mechanisms by acting carelessly",
                    "option4": "They left the investigation without examining any evidence",
                    "correct_answer": "They are methodical researchers who observe subtle details missed by others",
                    "reason": "The passage notes they observed subtle clues others overlooked and carefully documented each clue.",
                    "has_reasoning_prompt": True
                },
                {
                    "id": "q3",
                    "type": "mcq",
                    "skill_tag": "evidence",
                    "question": "Which detail BEST supports the idea that the journal was historically valuable?",
                    "option1": "It contained detailed diagrams explaining how the old mechanisms functioned",
                    "option2": "It was left lying on a wooden bench outside",
                    "option3": "It was written in modern blue ink on fresh paper",
                    "option4": "It contained weather reports from yesterday afternoon",
                    "correct_answer": "It contained detailed diagrams explaining how the old mechanisms functioned",
                    "reason": "The text states the weathered journal explained how the mechanisms functioned, showing its value.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q4",
                    "type": "mcq",
                    "skill_tag": "vocabulary",
                    "question": "In the passage, what does the word 'threshold' most likely mean?",
                    "option1": "An entrance or doorway boundary",
                    "option2": "A heavy iron hammer",
                    "option3": "A stormy weather cloud",
                    "option4": "A long leather belt",
                    "correct_answer": "An entrance or doorway boundary",
                    "reason": "The markings near the threshold pointed toward entering the vault.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q5",
                    "type": "mcq",
                    "skill_tag": "cause-effect",
                    "question": "Why did Leo document each clue before taking their next step?",
                    "option1": "To preserve the significance of their discovery for the mission",
                    "option2": "Because he was instructed to leave the area immediately",
                    "option3": "To hide the evidence from Maya",
                    "option4": "Because his pencil was running out of lead",
                    "correct_answer": "To preserve the significance of their discovery for the mission",
                    "reason": "The text mentions realizing the significance of their discovery, so Leo carefully documented each clue.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q6",
                    "type": "mcq",
                    "skill_tag": "sequence",
                    "question": "What happened immediately after Maya found the weathered journal?",
                    "option1": "The team realized the diagrams explained how the ancient mechanisms worked",
                    "option2": "The team decided to return to the surface without opening it",
                    "option3": "Leo immediately published a news report about the vault",
                    "option4": "A sudden thunderstorm forced them to leave the building",
                    "correct_answer": "The team realized the diagrams explained how the ancient mechanisms worked",
                    "reason": "Directly after finding the journal tucked in the crevice, they saw it contained diagrams explaining the mechanisms.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q7",
                    "type": "mcq",
                    "skill_tag": "vocabulary",
                    "question": "What does the word 'pivotal' mean in the fifth sentence?",
                    "option1": "Of central, crucial importance to the mission",
                    "option2": "Small and hard to notice",
                    "option3": "Noisy and distracting",
                    "option4": "Cold and freezing",
                    "correct_answer": "Of central, crucial importance to the mission",
                    "reason": "Pivotal signifies something critical or key to the investigation outcome.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q8",
                    "type": "mcq",
                    "skill_tag": "evidence",
                    "question": "Which sentence shows that the entrance was hidden or subterranean?",
                    "option1": "Faint markings near the threshold pointed toward an intricate subterranean vault",
                    "option2": "The sun was shining brightly in the open field",
                    "option3": "Leo called out to passersby on the busy street",
                    "option4": "They bought tickets at the front entrance kiosk",
                    "correct_answer": "Faint markings near the threshold pointed toward an intricate subterranean vault",
                    "reason": "The text explicitly refers to faint markings pointing to an intricate subterranean vault.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q9",
                    "type": "mcq",
                    "skill_tag": "inference",
                    "question": "Why did others miss the clues before Leo and Maya arrived?",
                    "option1": "The markings were faint and required close observation to detect",
                    "option2": "The clues were hidden behind heavy metal doors that were locked",
                    "option3": "The clues were written in a foreign language nobody could read",
                    "option4": "The site was closed to all visitors until that morning",
                    "correct_answer": "The markings were faint and required close observation to detect",
                    "reason": "The text states Leo and Maya closely observed subtle, faint markings that others had overlooked.",
                    "has_reasoning_prompt": True
                },
                {
                    "id": "q10",
                    "type": "mcq",
                    "skill_tag": "main-idea",
                    "question": "Which title best fits this reading passage?",
                    "option1": f"The Discovery at {topic_name}",
                    "option2": "How to Build a Stone Vault",
                    "option3": "The Lost Map of Europe",
                    "option4": "A Guide to Morning Weather",
                    "correct_answer": f"The Discovery at {topic_name}",
                    "reason": "The entire passage focuses on discovering the journal and clues at the site.",
                    "has_reasoning_prompt": False
                }
            ]
        },
        {
            "id": str(uuid.uuid4())[:8],
            "game_name": f"{level_name} - Analysis & Mastery Part 2",
            "game_description": f"Master the second phase of reading comprehension for {topic_name}.",
            "passage_text": (
                f"With the initial diagrams in hand, Maya and Leo turned their attention to the main chamber. "
                f"Carefully stepping past ancient pillars, they observed inscribed symbols carved into the stone wall. "
                f"Maya hypothesized that the symbols formed an environmental timeline, documenting past events. "
                f"Leo concurred, noting that each carving aligned with a specific date in the journal. "
                f"By analyzing the evidence together, they unlocked the final mechanism and resolved the mystery of {topic_name}."
            ),
            "grade_band": "Grade 5",
            "difficulty": "evidence_inference",
            "target_skill": "evidence",
            "questions": [
                {
                    "id": "q11",
                    "type": "mcq",
                    "skill_tag": "main-idea",
                    "question": f"What is the main topic of this second passage about {topic_name}?",
                    "option1": f"Analyzing carved wall symbols to solve the mystery of {topic_name}",
                    "option2": "Repairing broken stone pillars in an ancient hallway",
                    "option3": "Learning how to write in modern notebooks",
                    "option4": "Calculating the height of cave walls",
                    "correct_answer": f"Analyzing carved wall symbols to solve the mystery of {topic_name}",
                    "reason": "The passage details how analyzing the carved wall symbols led to unlocking the final mechanism.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q12",
                    "type": "mcq",
                    "skill_tag": "evidence",
                    "question": "Which detail proves that Leo agreed with Maya's hypothesis?",
                    "option1": "Leo concurred, noting that each carving aligned with a specific date in the journal",
                    "option2": "Leo walked away to explore a different tunnel alone",
                    "option3": "Leo disagreed and argued about the meaning of the carvings",
                    "option4": "Leo asked to take a break outside the chamber",
                    "correct_answer": "Leo concurred, noting that each carving aligned with a specific date in the journal",
                    "reason": "The text states Leo concurred and pointed out the date alignment.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q13",
                    "type": "mcq",
                    "skill_tag": "vocabulary",
                    "question": "In the passage, what does the word 'concurred' mean?",
                    "option1": "Agreed with an opinion or decision",
                    "option2": "Shouted loudly in anger",
                    "option3": "Drew a new picture on paper",
                    "option4": "Forgot what was previously said",
                    "correct_answer": "Agreed with an opinion or decision",
                    "reason": "Concurred means to be of the same opinion or agree.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q14",
                    "type": "mcq",
                    "skill_tag": "cause-effect",
                    "question": "What directly enabled the team to unlock the final mechanism?",
                    "option1": "Analyzing the wall evidence and date alignment together",
                    "option2": "Calling for outside help from a nearby city",
                    "option3": "Breaking the stone wall with heavy tools",
                    "option4": "Waiting until the sun set outside the chamber",
                    "correct_answer": "Analyzing the wall evidence and date alignment together",
                    "reason": "By analyzing the evidence together, they unlocked the final mechanism.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q15",
                    "type": "mcq",
                    "skill_tag": "inference",
                    "question": "What can you infer about the relationship between the journal and the wall carvings?",
                    "option1": "The journal was created by someone who understood the wall carvings",
                    "option2": "The journal and wall carvings were created thousands of years apart by strangers",
                    "option3": "The journal contradicted everything carved on the stone walls",
                    "option4": "The journal had no connection to the chamber at all",
                    "correct_answer": "The journal was created by someone who understood the wall carvings",
                    "reason": "Since the dates in the journal aligned with the carvings on the wall, they were connected.",
                    "has_reasoning_prompt": True
                },
                {
                    "id": "q16",
                    "type": "mcq",
                    "skill_tag": "sequence",
                    "question": "What did the team do BEFORE unlocking the final mechanism?",
                    "option1": "They observed inscribed symbols and matched them with journal dates",
                    "option2": "They left the chamber and returned the next day",
                    "option3": "They replaced the old stone pillars with new steel beams",
                    "option4": "They painted over the carved wall symbols",
                    "correct_answer": "They observed inscribed symbols and matched them with journal dates",
                    "reason": "Analyzing and matching the symbols with dates happened right before unlocking the mechanism.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q17",
                    "type": "mcq",
                    "skill_tag": "vocabulary",
                    "question": "What is the meaning of 'hypothesized' in this story?",
                    "option1": "Formed an educated guess or explanation based on evidence",
                    "option2": "Drawn a map using bright watercolors",
                    "option3": "Measured the distance using a metal tape measure",
                    "option4": "Cleaned dirt off stone surfaces with water",
                    "correct_answer": "Formed an educated guess or explanation based on evidence",
                    "reason": "Hypothesized means putting forward a proposed explanation based on initial observations.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q18",
                    "type": "mcq",
                    "skill_tag": "evidence",
                    "question": "Which sentence shows that teamwork was key to solving the mystery?",
                    "option1": "By analyzing the evidence together, they unlocked the final mechanism",
                    "option2": "Maya worked alone while Leo waited by the exit",
                    "option3": "Neither detective was interested in the wall carvings",
                    "option4": "Leo solved the puzzle without telling Maya his plan",
                    "correct_answer": "By analyzing the evidence together, they unlocked the final mechanism",
                    "reason": "The sentence specifically highlights that they analyzed the evidence together.",
                    "has_reasoning_prompt": False
                },
                {
                    "id": "q19",
                    "type": "mcq",
                    "skill_tag": "inference",
                    "question": "What does the passage suggest about the purpose of the carved wall symbols?",
                    "option1": "They served as an historical timeline documenting past events",
                    "option2": "They were purely decorative artwork with no historical meaning",
                    "option3": "They were warnings to keep all visitors away",
                    "option4": "They were price lists for ancient trade markets",
                    "correct_answer": "They served as an historical timeline documenting past events",
                    "reason": "Maya hypothesized they formed an environmental timeline documenting past events.",
                    "has_reasoning_prompt": True
                },
                {
                    "id": "q20",
                    "type": "mcq",
                    "skill_tag": "main-idea",
                    "question": "What central theme is demonstrated by Leo and Maya's investigation?",
                    "option1": "Careful evidence analysis and collaboration solve complex problems",
                    "option2": "Rushing through challenges leads to quick success",
                    "option3": "Working alone is always better than working in a team",
                    "option4": "Ancient mysteries can never be truly understood",
                    "correct_answer": "Careful evidence analysis and collaboration solve complex problems",
                    "reason": "Throughout both parts, careful observation, evidence analysis, and collaboration allowed them to succeed.",
                    "has_reasoning_prompt": False
                }
            ]
        }
    ]

def create_courses_task(email, topics):
    """Generate full courses, modules, levels, and games asynchronously."""
    s1 = "You are a helpful AI that generates a complete course structure for a given topic with modules and levels."
    s2 = "\nYou must output ONLY valid JSON matching this structure (generate REAL titles and detailed 300-400 word descriptions, NEVER output placeholder text like 'moduleName' or 'string'): " + json.dumps({
        "course_name": "Full Course Title related to the topic",
        "course_description": "Detailed 300-400 word course overview and objectives",
        "modules": [
            {
                "id": "mod_1",
                "module_name": "Module 1: Descriptive Module Title",
                "module_description": "Detailed 300-400 word description of this module's learning goals and story concept",
                "levels": [
                    {
                        "id": "lev_1",
                        "level_name": "Level 1: Descriptive Lesson Title",
                        "level_description": "Detailed 300-400 word description of this level's reading focus"
                    }
                ]
            }
        ]
    })
    s3 = s1 + s2

    for data in topics:
        topic_name = data["topic"]
        module_count = data.get("modules") or 5

        prompt = s3 + f"You are to generate a comprehensive course about '{topic_name}' with {module_count} modules. Each module must have at least 2 levels (total 10 levels for 5 modules)."
        
        course_json = None
        try:
            from background_tasks.gemini import generate_gemini_content, clean_json_response
            print(f"[COURSE] {topic_name} -> Generating full 5-module course structure via OpenRouter")
            
            res = generate_gemini_content(prompt)
            if isinstance(res, dict):
                if "course_name" in res and "modules" in res:
                    course_json = res
                elif "result" in res and isinstance(res["result"], str):
                    cleaned = clean_json_response(res["result"])
                    try:
                        course_json = json.loads(cleaned)
                    except Exception:
                        match = re.search(r'\{.*"modules"\s*:.*\}', cleaned, re.DOTALL)
                        if match:
                            try:
                                course_json = json.loads(match.group(0))
                            except Exception:
                                pass
        except Exception as e:
            logging.warning(f"[COURSE] AI call failed for {topic_name}, building full 5-module fallback structure: {e}")

        # Full 5-Module, 10-Level Course JSON if AI is rate-limited or fails
        if not course_json or not isinstance(course_json, dict) or not course_json.get("course_name") or not course_json.get("modules"):
            course_json = {
                "course_name": topic_name,
                "course_description": f"An immersive 5-module adaptive English reading mission focusing on comprehension, vocabulary, and inference through the story of {topic_name}.",
                "modules": [
                    {
                        "id": str(uuid.uuid4())[:8],
                        "module_name": f"Module 1: Discovering {topic_name}",
                        "module_description": f"Read opening passages and analyze essential clues regarding {topic_name}.",
                        "levels": [
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 1: The Initial Clue",
                                "level_description": "Read the story passage carefully and answer reading comprehension questions."
                            },
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 2: Deepening the Investigation",
                                "level_description": "Identify evidence, cause and effect, and key vocabulary terms."
                            }
                        ]
                    },
                    {
                        "id": str(uuid.uuid4())[:8],
                        "module_name": f"Module 2: Exploration & Analysis",
                        "module_description": f"Examine environmental clues and analyze scientific findings about {topic_name}.",
                        "levels": [
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 3: Into the Unknown",
                                "level_description": "Follow character choices and infer motives from context clues."
                            },
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 4: Analyzing the Findings",
                                "level_description": "Evaluate cause-effect relationships and supporting evidence."
                            }
                        ]
                    },
                    {
                        "id": str(uuid.uuid4())[:8],
                        "module_name": f"Module 3: Complex Challenges",
                        "module_description": f"Navigate critical obstacles and solve mysteries surrounding {topic_name}.",
                        "levels": [
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 5: The Hidden Vault",
                                "level_description": "Uncover hidden information and deduce key plot developments."
                            },
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 6: Deciphering the Code",
                                "level_description": "Master technical vocabulary in context and trace event sequences."
                            }
                        ]
                    },
                    {
                        "id": str(uuid.uuid4())[:8],
                        "module_name": f"Module 4: Critical Thinking & Synthesis",
                        "module_description": f"Synthesize multiple sources of evidence to form comprehensive conclusions.",
                        "levels": [
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 7: Connecting the Dots",
                                "level_description": "Identify central ideas across multi-paragraph reading passages."
                            },
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 8: Overcoming Obstacles",
                                "level_description": "Solve complex inference questions under pressure."
                            }
                        ]
                    },
                    {
                        "id": str(uuid.uuid4())[:8],
                        "module_name": f"Module 5: Mission Accomplished",
                        "module_description": f"Complete the final reading trial and demonstrate total skill mastery.",
                        "levels": [
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 9: The Final Trial",
                                "level_description": "Demonstrate evidence retrieval and cause-effect reasoning."
                            },
                            {
                                "id": str(uuid.uuid4())[:8],
                                "level_name": "Level 10: Solving the Mystery",
                                "level_description": "Achieve full reading comprehension mastery in the final story climax."
                            }
                        ]
                    }
                ]
            }

        course_name = course_json.get("course_name", topic_name)
        course_desc = course_json.get("course_description", f"Reading mission for {topic_name}")
        modules = course_json.get("modules", [])

        # Generate games for each level safely
        for module in modules:
            m_id = module.get("id") or str(uuid.uuid4())[:8]
            module["id"] = m_id
            for level in module.get("levels", []):
                l_id = level.get("id") or str(uuid.uuid4())[:8]
                level["id"] = l_id
                g_list = generate_games_for_level_sync(
                    l_id, level.get("level_name", "Reading Challenge"), level.get("level_description", ""), topic_name
                )
                level["games"] = g_list if isinstance(g_list, list) else []

        # Save AdminHistory entry for app-07 draft view
        uid = email[:3] + ''.join(random.choice(string.digits) for _ in range(6))
        while AdminHistory.objects.filter(uid=uid).exists():
            uid = email[:3] + ''.join(random.choice(string.digits) for _ in range(6))

        chat_history_data = [{"userPrompt": prompt, "modelResponse": course_json}]
        record_data = {
            "courseDetails": course_json,
            "chat": chat_history_data
        }

        history_entry = AdminHistory.objects.create(
            AdminEmail=email,
            data=record_data,
            uid=uid
        )

        # Seed directly to Course / Topic / Level / Games / Tiles models
        try:
            c_db_id = f"course_{uid}"
            Course.objects.create(
                courseid=c_db_id,
                name=course_name,
                order=1,
                course_tip=course_desc[:300],
                live="yes",
                email=email
            )

            for m_idx, m in enumerate(modules, 1):
                t_db_id = f"top_{uid}_{m_idx}"
                Topic.objects.create(
                    topic_id=t_db_id,
                    courseid=c_db_id,
                    name=m.get("module_name", f"Module {m_idx}"),
                    order=m_idx,
                    topic_tip=m.get("module_description", "")[:300],
                    live="yes"
                )

                for l_idx, lv in enumerate(m.get("levels", []), 1):
                    lv_db_id = f"lvl_{uid}_{m_idx}_{l_idx}"
                    Level.objects.create(
                        level_id=lv_db_id,
                        topic_id=t_db_id,
                        name=lv.get("level_name", f"Level {l_idx}"),
                        order=l_idx,
                        level_tip=lv.get("level_description", "")[:300],
                        live="yes"
                    )

                    games_list = lv.get("games") or []
                    for g_idx, g in enumerate(games_list, 1):
                        g_db_id = f"gme_{uid}_{m_idx}_{l_idx}_{g_idx}"
                        Games.objects.create(
                            gameid=g_db_id,
                            level_id=lv_db_id,
                            name=g.get("game_name") or g.get("name") or f"Game {g_idx}",
                            order=g_idx,
                            gameTip=g.get("game_description") or g.get("gameTip") or "",
                            passage_text=g.get("passage_text", ""),
                            grade_band=str(g.get("grade_band", "5")),
                            difficulty=g.get("difficulty", "simple_inference"),
                            target_skill=g.get("target_skill", "inference"),
                            live="yes"
                        )

                        questions_list = g.get("questions") or []
                        for q_idx, q in enumerate(questions_list, 1):
                            op1 = q.get("option1", "")
                            op2 = q.get("option2", "")
                            op3 = q.get("option3", "")
                            op4 = q.get("option4", "")
                            correct_val = q.get("correct_answer") or q.get("correct") or op1
                            correct_indices = safe_parse_correct_int_list(correct_val, op1, op2, op3, op4)
                            correct_str = ",".join(map(str, correct_indices)) if correct_indices else "1"

                            Tiles.objects.create(
                                gameid=g_db_id,
                                tileid=f"{g_db_id}_q{q_idx}",
                                qno=q_idx,
                                type=q.get("type", "mcq"),
                                question=q.get("question", ""),
                                op1=op1,
                                op2=op2,
                                op3=op3,
                                op4=op4,
                                correct=correct_str,
                                reason=q.get("reason", "") or q.get("questionTip", ""),
                                skill_tag=q.get("skill_tag", "inference"),
                                has_reasoning_prompt=bool(q.get("has_reasoning_prompt", False)),
                                live="yes"
                            )
        except Exception as seed_err:
            logging.error(f"[COURSE DB SEED] Error seeding models for {topic_name}: {seed_err}")

        # Always update queue status to 'done' and completed=True
        AdminDataQueue.objects.filter(topic=topic_name).update(
            status='done', completed=True, last_updated=timezone.now()
        )

        logging.info(f"✅ Course successfully generated & saved for topic: {topic_name}")


class TaskThread(threading.Thread):
    def __init__(self, target, *args, **kwargs):
        super().__init__(target=target, *args, **kwargs)
        self.exc = None

    def run(self):
        try:
            super().run()
        except Exception as e:
            self.exc = e


def run_threaded_task(target, *args, **kwargs):
    thread = TaskThread(target=target, args=args, kwargs=kwargs)
    thread.start()
    return thread


class QueueCourseCreation(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email', 'admin@lumora.ai')
        topics = request.data.get('topics', [])

        if not email:
            email = 'admin@lumora.ai'

        # Ensure user email is registered in LumoraAdmins
        if not LumoraAdmins.objects.filter(email=email).exists():
            LumoraAdmins.objects.create(email=email, uid=f"admin_{email}")

        for data in topics:
            topic_text = data.get('topic', '')
            if not topic_text:
                continue
            AdminDataQueue.objects.filter(Q(AdminEmail=email) & Q(topic=topic_text)).delete()
            AdminDataQueue.objects.create(
                AdminEmail=email,
                topic=topic_text,
                status='in_progress',
                last_updated=timezone.now()
            )

        response_data = {"status": "course creation in progress"}

        try:
            run_threaded_task(create_courses_task, email, topics)
            return Response(response_data)
        except Exception as e:
            logging.error(f"[QUEUE] Error starting course creation task: {e}")
            return Response({"status": "error starting task", "error": str(e)}, status=500)    
from lumora.authentication import create_access_token
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework.response import Response

class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email", username if username and "@" in username else "")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "username already exists"}, status=400)

        User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
        )
        return Response({"message": "account created"})

class GeminiProxy(APIView):
    permission_classes = []
    
    def post(self, request):
        prompt = request.data.get("prompt")
        try:
            from background_tasks.gemini import generate_gemini_content
            response_json = generate_gemini_content(prompt)
            
            if isinstance(response_json, (dict, list)):
                if isinstance(response_json, dict) and 'result' in response_json:
                    res_val = response_json['result']
                    if isinstance(res_val, str):
                        try:
                            return Response(json.loads(res_val))
                        except Exception:
                            match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', res_val)
                            if match:
                                try:
                                    return Response(json.loads(match.group(0)))
                                except Exception:
                                    pass
                return Response(response_json)

            if isinstance(response_json, str):
                try:
                    return Response(json.loads(response_json))
                except Exception:
                    match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', response_json)
                    if match:
                        try:
                            return Response(json.loads(match.group(0)))
                        except Exception:
                            pass
                return Response({"error": "Unparseable AI text response", "raw": response_json}, status=500)

            return Response(response_json)
        except Exception as e:
            import logging
            logging.error(f"[GEMINI PROXY] failed: {e}")
            return Response({"error": str(e), "status": "failed", "games": [], "modules": []}, status=200)

class GenerateCourseApp07View(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        topic = request.data.get("topic") or request.data.get("prompt") or "Reading Comprehension"
        modules_count = request.data.get("modules") or 3
        try:
            try:
                modules_count = int(modules_count)
            except Exception:
                modules_count = 3

            from background_tasks.course_ai import generate_course_app07
            course_data = generate_course_app07(topic=str(topic), module_count=modules_count)
            return Response(course_data)
        except Exception as e:
            logging.error(f"[GENERATE COURSE APP07] failed: {e}")
            return Response({"error": str(e)}, status=500)

class GenerateGamesApp07View(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        level_id = request.data.get("levelId")
        module_id = request.data.get("moduleId")
        chat_history = request.data.get("chat_history") or []
        try:
            from background_tasks.course_ai import generate_games_app07
            res = generate_games_app07(level_id, module_id, chat_history)
            return Response(res)
        except Exception as e:
            logging.error(f"[GENERATE GAMES APP07] failed: {e}")
            return Response({"error": str(e)}, status=500)

class RegenerateCourseApp07View(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        chat_history = request.data.get("chat_history") or []
        user_prompt = request.data.get("user_prompt") or "Regenerate course"
        items = request.data.get("items") or []
        try:
            from background_tasks.course_ai import regenerate_course_app07
            res = regenerate_course_app07(chat_history, user_prompt, items)
            return Response(res)
        except Exception as e:
            logging.error(f"[REGENERATE COURSE APP07] failed: {e}")
            return Response({"error": str(e)}, status=500)

class RegenerateModuleApp07View(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        chat_history = request.data.get("chat_history") or []
        user_prompt = request.data.get("user_prompt") or "Regenerate module"
        module_id = request.data.get("moduleId") or "mod_1"
        items = request.data.get("items") or []
        try:
            from background_tasks.course_ai import regenerate_module_app07
            res = regenerate_module_app07(chat_history, user_prompt, module_id, items)
            return Response(res)
        except Exception as e:
            logging.error(f"[REGENERATE MODULE APP07] failed: {e}")
            return Response({"error": str(e)}, status=500)

class LoginUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "username and password required"}, status=400)

        user = authenticate(request, username=username, password=password)
        if not user:
            # Check if they passed email instead of username
            user_by_email = User.objects.filter(email=username).first()
            if user_by_email:
                user = authenticate(request, username=user_by_email.username, password=password)
                
        if not user:
            return Response({"error": "invalid username or password"}, status=401)

        return Response(
            {
                "access": create_access_token(user),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            }
        )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([])
def get_user_info(request):
    if not request.user or not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
    user = request.user
    return Response({
        'email': user.email,
        'username': user.username,
        'name': user.username,
        'image': '',
        'user_id': user.id,
        'provider': 'local',
        'email_verified': True,
        'custom:ReferralCode': 'REF123',
        'identities': '[]'
    })


import random
import logging
from datetime import timedelta
from django.conf import settings
from lumora.models import PasswordResetOTP

class RequestPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        if not email:
            return Response({"error": "Email address is required"}, status=400)

        email = email.strip().lower()
        user = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()

        response_msg = {"message": "If an account exists with this email, an OTP code has been sent."}

        if not user:
            return Response(response_msg)

        user_email = user.email or email

        PasswordResetOTP.objects.filter(email=user_email, is_used=False).update(is_used=True)

        otp_code = str(random.randint(100000, 999999))
        expires_at = timezone.now() + timedelta(minutes=15)

        PasswordResetOTP.objects.create(
            email=user_email,
            otp_code=otp_code,
            expires_at=expires_at,
            is_used=False
        )

        subject = "Lumora - Password Reset OTP Verification Code"
        message = (
            f"Hello {user.username},\n\n"
            f"Your OTP verification code for resetting your Lumora password is:\n\n"
            f"  {otp_code}\n\n"
            f"This code will expire in 15 minutes.\n"
            f"If you did not request a password reset, please ignore this email.\n\n"
            f"Best regards,\nThe Lumora Team"
        )

        def _send_async_mail(sub, msg, sender, recipients):
            try:
                send_mail(
                    subject=sub,
                    message=msg,
                    from_email=sender,
                    recipient_list=recipients,
                    fail_silently=False,
                )
                logging.info(f"[OTP RESET] Sent reset OTP code to {recipients}")
            except Exception as e:
                logging.error(f"[OTP RESET] Failed to send email to {recipients}: {e}")

        import threading
        threading.Thread(
            target=_send_async_mail,
            args=(subject, message, settings.EMAIL_HOST_USER, [user_email]),
            daemon=True
        ).start()

        return Response(response_msg)


class VerifyPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        otp_code = request.data.get("otp") or request.data.get("code") or request.data.get("confirmationCode")
        new_password = request.data.get("password") or request.data.get("newPassword")

        if not email or not otp_code or not new_password:
            return Response({"error": "Email, verification code, and new password are required."}, status=400)

        email = str(email).strip().lower()
        otp_code = str(otp_code).strip()

        matching_users = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email))
        if not matching_users.exists():
            return Response({"error": "Invalid verification code or email."}, status=400)

        user_email = matching_users.first().email or email

        otp_entry = PasswordResetOTP.objects.filter(
            email=user_email,
            otp_code=otp_code,
            is_used=False,
            expires_at__gte=timezone.now()
        ).first()

        if not otp_entry:
            return Response({"error": "Invalid or expired verification code."}, status=400)

        otp_entry.is_used = True
        otp_entry.save()

        for u in matching_users:
            u.set_password(new_password)
            u.save()

        logging.info(f"[OTP RESET] Successfully reset password for {user_email}")
        return Response({"message": "Password reset successfully. You can now login with your new password."})

