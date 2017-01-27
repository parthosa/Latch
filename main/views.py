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
from operator import itemgetter
from django.contrib.sessions.models import Session

@csrf_exempt
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

@csrf_exempt
def Register(request):
	print request.POST
	if request.POST:
		name = request.POST['name']
		contact = request.POST['contact'] # could be either phone or email id
		password = request.POST['password']
		confirm_password = request.POST['confirm_password']

		registered_users = User.objects.all()
		registered_contacts = [x.username for x in registered_users]
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
					member.save()
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
				return JsonResponse({'status': 1, 'message': 'You will be redirected to where we can know you better! :D','user_session': request.session.session_key})
		else:
			return JsonResponse({'status': 0, 'message': 'Your password did not match'})

@csrf_exempt
def login_user(request):
	# print request.POST
	if request.method == 'POST':
		contact = request.POST['contact']
		password = request.POST['password']
		user = authenticate(username = contact, password = password)

		if user:
			login(request,user)
			print request.session.session_key
			return JsonResponse({'status':1, 'message': 'Successfully logged in', 'user_session': request.session.session_key})
			
		else:
			return JsonResponse({'status': 0, 'message': 'Invalid credentials'})
@csrf_exempt
def nick_name(request):
	if request.POST:
		nick = request.POST['nick']
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		if not nick in [x.nick_name for x in UserProfile.objects.all()]:	
			user_p = UserProfile.objects.get(user = user)
			user_p.nick_name = nick
			user_p.save()
			response = {'status': 1, 'message': 'Nick name was successfully saved'}
		else:
			response = {'status': 0, 'message': 'This nick name is already registered. Kindly come up with something else.'}

		return JsonResponse(response)

@csrf_exempt
def profile_pic(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	if 'getfromfb' in request.POST:
		fbdp = request.POST['fbdp']
		user_p.dp_url = fbdp
		user_p.save()
		response = {'status':1, 'message': 'dp has been successfully saved'}
	else:
		user_image = request.POST['dp']
		user_p.dp = user_image
		user_p.save()


@csrf_exempt
def logout_user(request):
	logout(request)
	return JsonResponse({'status': 1, 'message': 'You have been successfully logged out'})

@csrf_exempt
def interests(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
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

@csrf_exempt
def get_location(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		lat = request.POST['lat']
		longitude = request.POST['longitude']
		user_p = UserProfile.objects.get(user = user)
		user_p.lat = lat
		user_p.longitude = longitude
		location_url = '''http://dev.virtualearth.net/REST/v1/Locations/%s,%s?key=Ai8hP_n0kTIQevn9nbLOFcKSqVHEicYiCfB81mPR_iWgDwjIdAIa7JOBktWjjmC3''' % (lat, longitude)
		json_data = json.loads(urlopen(location_url))
		locality = json_data['resourceSets'][0]['resources'][0]['address']['locality']
		user_p.locality = locality
		user_p.save()
		return JsonResponse({'status': 1, 'message': 'Your current location has been saved successfully.'})

@csrf_exempt
def add_to_chatroom(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	lat = user_p.lat #test case
	longitude = user_p.longitude #test case
	location_url = '''http://dev.virtualearth.net/REST/v1/Locations/%s,%s?key=Ai8hP_n0kTIQevn9nbLOFcKSqVHEicYiCfB81mPR_iWgDwjIdAIa7JOBktWjjmC3''' % (lat, longitude)
	json_data = json.loads(urlopen(location_url))
	locality = json_data['resourceSets'][0]['resources'][0]['address']['locality']

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

@csrf_exempt
def send_nearby(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	locality = user_p.locality
	nearby_users = UserProfile.objects.filter(locality = locality)
	nearby_list = []
	for user in nearby_users:
		distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&estinations%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, user.lat, user.longitude)
		json_data = json.loads(urlopen(distance_url))
		b_distance = json_data['rows'][0]['elements'][0]['distance']['text'][:-3]
		nearby_list.append({'nick': user.nick_name, 'distance': 1.60934*b_distance})
	nearby_users = sorted(nearby_list, itemgetter('distance'))

	return JsonResponse({'status': 1, 'nearby_users': nearby_users})

@csrf_exempt
def get_members_chatroom(request, room_name):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		group = Group.objects.get(name = room_name)
		if user_p in groups.members.all():
			g_members = groups.members.all()
			g_members_name = [x.nick_name for x in g_members]
			response = {'status': 1, 'members': g_members_name}
		else:
			response = {'status': 0, 'message': 'You are not allowed to view members of this group'}

		return JsonResponse(response)

@csrf_exempt
def go_anonymous(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	if user_p.anonymous == True:
		response = {'status': 0, 'message': 'You are already anonymous'}
		return JsonResponse(response)
	else:
		user_p.anonymous = True
		user_p.save()
		response = {'status': 1, 'message': 'You have gone anonymous'}
		return JsonResponse(response)

def test_room(request, label):
	try:
		group = Group.objects.get(name = label)
	except ObjectDoesNotExist:
		group = Group.objects.create(name = label)

	try:
		messages = reversed(group.message.order_by('-timestamp')[:])
	except:
		message = 'fgh'

	return render(request, 'chat/room.html', {'room': group, 'messages': message})

@csrf_exempt
def get_chatroom(request, group_name):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	messages = reversed(Message.objects.filter(group = group_name).order_by('-timestamp'))
	user_group = User_group(user = user_p, group = group_name)
	msg_list = []
	for message in messages:
		msg_list.append({'message': message.message, 'nick_name': message.user.nick_name, 'time': message.timestamp})

	response = {'messages': msg_list}
	return JsonResponse(response)

@csrf_exempt
def node_api_message_group(request):
	try:
        #Get User from sessionid
	        # post_string = request.POST['key']
	        # post_item_list = post_string.split(',')
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
        #Create message

		user_p = UserProfile.objects.get(user = user)
		group = Group.objects.get(name = request.POST['group_name'])
		message_create = Message.objects.create(message = request.POST['message'], user = user, group = group, timestamp = datetime.now, msg_id = request.POST['msg_id'])
 		message = Message.objects.get(msg_id = post_item_list['msg_id'])
 		group.message.add(message)
		group.save()
        #Once comment has been created post it to the chat channel
		# r = redis.StrictRedis(host='localhost', port=6379, db=0)
		# r.publish('chat_message', user_p.nick_name + ': ' + request.POST['message'] + ':' + datetime.now)
        
		return HttpResponse("Everything worked :)")
	except Exception, e:
		return HttpResponseServerError(str(e))

@csrf_exempt
def node_api_message_user(request):
	try:
        #Get User from sessionid
		# post_string = request.POST['key']
		# post_item_list = post_string.split(',')
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
        #Create message

		user_p = UserProfile.objects.get(user = user)
		user_c = UserProfile.objects.get(nick_name = request.POST['nick'])
		try:
			group = Indi_group.objects.get(user1 = user_p, user2 = user_c)
		except ObjectDoesNotExist:
			group = Indi_group.objects.get(user2 = user_p, user1 = user_c)

		message_create = Indi_msg.objects.create(message = request.POST['message'], user = user, group = group, timestamp = datetime.now, msg_id = request.POST['msg_id'])
 		message = Indi_msg.objects.get(msg_id = request.POST['msg_id'])
 		group.message.add(message)
		group.save()
        #Once comment has been created post it to the chat channel
		# r = redis.StrictRedis(host='localhost', port=6379, db=0)
		# r.publish('chat_message', user_p.nick_name + ': ' + request.POST['message'] + ':' + datetime.now)
        
		return HttpResponse("Everything worked :)")
	except Exception, e:
		return HttpResponseServerError(str(e))

# zomato api key - 74c47b6322c6a40d4bef924bf238548c

@csrf_exempt
def user_groups(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		groups = user_p.groups.all()
		group_list = []
		for group in groups:
			group_list.append({'group_name': group.name})

		return JsonResponse({'groups': group_list})

@csrf_exempt
def user_users(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		i_group1 = Indi_group.objects.filter(user1 = user_p)
		print i_group1
		i_group2 = Indi_group.objects.filter(user2 = user_p)

		# i_group = i_group1 + i_group2
		user_list = []
		for user in i_group1:
			distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&estinations%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, user.lat, user.longitude)
			json_data = json.loads(urlopen(distance_url))
			distance = json_data['rows'][0]['elements'][0]['distance']['text'][:-3]
			user_list.append({'nick': user.nick_name, 'pic': user.dp_url, 'distance': distance})
		for user in i_group2:
			distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&estinations%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, user.lat, user.longitude)
			json_data = json.loads(urlopen(distance_url))
			distance = json_data['rows'][0]['elements'][0]['distance']['text'][:-3]
			user_list.append({'nick': user.nick_name, 'pic': user.dp_url, 'distance': distance})

		return JsonResponse({'peers': user_list})

@csrf_exempt
def get_indi_chat(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	user_t = UserProfile.objects.get(nick_name = request.POST['nick_name'])
	try:
		indi_chat = Indi_group.objects.get(user1 = user_p, user2 = user_t)
	except ObjectDoesNotExist:
		indi_chat = Indi_group.objects.get(user2 = user_p, user1 = user_t)

	messages = indi_chat.objects.message.all()
	msg_list = []
	for message in messages:
		msg_list.append({'message': message.message, 'nick_name': message.user.nick_name, 'time': message.timestamp})

	response = {'messages': msg_list}
	return JsonResponse(response)

@csrf_exempt
def test_node_api(request):
	print 1
	# if request.POST:
	print request.POST
	# c = request.POST['comment']
	# print c
	return JsonResponse({'message': 'c'})
	# else:
	# 	print 2
	# 	print request.session.session_key
	# 	return JsonResponse({'partho_chutiya': request.session.session_key})

def test_chat(request):
	print request.session.session_key
	context = {'comments': ['asda'], 'partho_chutiya': request.session.session_key}
	return render(request, 'main/index.html', context)


# @login_required
# def suggest_rest
def test(request):
	print request.user.username
	return JsonResponse({'done': 'yes'})

