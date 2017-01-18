from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponseRedirect,Http404,HttpResponse, JsonResponse
from django.core.cache import cache
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login ,logout
from .models import *
import requests
import json
from urllib2 import urlopen
from django.views.decorators.cache import cache_page
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
import re

def social_login(request):
	if request.POST:
		fbid = request.POST['fbid']
		name = request.POST['name']
		try:
			user = User.objects.get(username = fbid)
			user_login = authenticate(username = fbid, password = fbid)
			login(request, user_login)
			response = {'status': 1, 'message': 'Login Successful'}
			return JsonResponse(response)
		except:
			user = User.objects.create_user(username = fbid, password = fbid)
			user.save()
			member = UserProfile()
			member.name = name
			member.user = user
			member.fbid = fbid
			member.save()
			user_login = authenticate(username = fbid, password = fbid)
			login(request, user_login)
			return JsonResponse({'status': 2, 'message': 'You will be redirected to where we can know you better! :D'})

def Register(request):
	if request.POST:
		name = request.POST['name']
		contact = request.POST['contact'] # could be either phone or email id
		password = request.POST['password']
		confirm_password = request.POST['confirm_password']

		registered_users = User.objects.all()
		registered_contacts = [x.contact for x in registered_users]
		if password == confirm_password:
			if contact in registered_contacts:
				if type(contact) is int:	
					return JsonResponse({'status':0, 'message': 'This contact number is already registered.'})
				else:	
					return JsonResponse({'status':0, 'message': 'This email is already registered.'})

			elif not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", contact): #or type(contact) is int:
				if not type(contact) is int and len(contact) == 10:
					return JsonResponse({'status': 0, 'message': 'Kindly enter a valid phone number or email'})
				else:
					user = User.objects.create_user(username = contact, password = password)
					user.save()
					member = UserProfile()
					member.name = name
					member.user = user
					return JsonResponse({'status': 1, 'message': 'You will be redirected to where we can know you better! :D'})
			else:
				user = User.objects.create_user(username = contact, password = password)
				user.save()
				member = UserProfile()
				member.name = name
				member.user = user
				member.save()
				user_login = authenticate(username = contact, password = password)
				login(request, user_login)
				return JsonResponse({'status': 1, 'message': 'You will be redirected to where we can know you better! :D'})
		else:
			return JsonResponse({'status': 0, 'message': 'Your password did not match'})

@login_required
def nick_name(request):
	if request.POST:
		nick = request.POST['nick']
		if not nick in [x.nick_name for x in UserProfile.objects.all()]:	
			user_p = UserProfile.objects.get(user = request.user)
			user_p.nick_name = nick
			user_p.save()
			response = {'status': 1, 'message': 'Nick name was successfully saved'}
		else:
			response = {'status': 0, 'message': 'This nick name is already registered. Kindly come up with something else.'}

		return JsonResponse(response)

@login_required
def interests(request):
	user_p = UserProfile.objects.get(user = request.user)
	if request.POST:
		for interest in request.POST:
			interest_object = Interest.objects.get(name = interest)
			user_p.interests.add(interest_object)
			user_p.save()

		response = {'status': 1, 'message': 'Interests added successfully.'}
		return JsonResponse(response)

	else:
		interests = Interest.objects.all()
		interest_names = [x.name for x in interests]

		response = {'interests': interest_names, 'user_name': user_p.name}
		return JsonResponse(response)

@login_required
def add_to_chatroom(request):
	lat = 28.7041 #test case
	longitude = 77.1025 #test case
	location_url = '''http://dev.virtualearth.net/REST/v1/Locations/%s,%s?key=Ai8hP_n0kTIQevn9nbLOFcKSqVHEicYiCfB81mPR_iWgDwjIdAIa7JOBktWjjmC3''' % (lat, longitude)
	json_data = json.loads(urlopen(location_url))
	locality = json_data['resourceSets'][0]['resources'][0]['address']['locality']
	user_p = UserProfile.objects.get(user = request.user)
	groups = []
	for interest in user_p.interests.all():
		try:
			user_group = Group.objects.get(locality = locality, interest = interest)
			user_group.members.add(user_p)
			user_p.groups.add(user_group)
			user_group.save()
			user_p.save()
			Group_user.objects.create(user = user_p, group = user_group, time_joined = datetime.now)
			# groups.append(user_group.name)
		except ObjectDoesNotExist:
			user_group = Group.objects.create(locality = locality, interest = interest)
			user_group.members.add(user_p)
			user_p.groups.add(user_group)
			user_group.save()
			user_p.save()
			Group_user.objects.create(user = user_p, group = user_group, time_joined = datetime.now)
			# groups.append(user_group.name)

	response = {'status': 1, 'message': 'You have been added to the following groups', 'groups': groups}

@login_required
def get_members_chatroom(request, room_name):
	if request.POST:
		user_p = UserProfile.objects.get(user = request.user)
		group = Group.objects.get(name = room_name)
		if user_p in groups.members.all():
			g_members = groups.members.all()
			g_members_name = [x.nick_name for x in g_members]
			response = {'status': 1, 'members': g_members_name}
		else:
			response = {'status': 0, 'message': 'You are not allowed to view members of this group'}

		return JsonResponse(response)

@login_required
def go_anonymous(request):
	user_p = UserProfile.objects.get(user = request.user)
	if user_p.anonymous == True:
		response = {'status': 0, 'message': 'You are already anonymous'}
		return JsonResponse(response)
	else:
		user_p.anonymous = True
		user_p.save()
		response = {'status': 1, 'message': 'You have gone anonymous'}
		return JsonResponse(response)

# def test_room(request, label):
# 	try:
# 		group = Group.objects.get(name = label)
# 	except ObjectDoesNotExist:
# 		group = Group.objects.create(name = label)

# 	try:
# 		messages = reversed(group.message.order_by('-timestamp')[:])
# 	except:
# 		message = 'fgh'

# 	return render(request, 'chat/room.html', {'room': group, 'messages': message})

@login_required
def get_chatroom(request, group_name):
	user_p = UserProfile.objects.get(user = request.user)
	messages = reversed(Message.objects.filter(group = group_name).order_by('-timestamp'))
	user_group = User_group(user = user_p, group = group_name)
	msg_list = []
	for message in messages:
		msg_list.append({'message': message.message, 'nick_name': message.user.nick_name, 'time': message.timestamp})

	response = {'messages': msg_list}
	return JsonResponse(response)

@login_required
def node_api_message(request ,group_name):
    try:
        #Get User from sessionid
        session = Session.objects.get(session_key=request.POST.get('sessionid'))
        user_id = session.get_decoded().get('_auth_user_id')
        user = User.objects.get(id=user_id)
 
        #Create message
        user_p = UserProfile.objects.get(user = request.user)
        group = Group.objects.get(name = group_name)
        message = Message.objects.create(message = request.POST['message'], user = request.user, group = group, timestamp = datetime.now)
        group.message.add(message)
        group.save()
        #Once comment has been created post it to the chat channel
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        r.publish('chat_message', user_p.nick_name + ': ' + request.POST['message'] + ':' + datetime.now)
        
        return HttpResponse("Everything worked :)")
    except Exception, e:
        return HttpResponseServerError(str(e))

# zomato api key - 74c47b6322c6a40d4bef924bf238548c

