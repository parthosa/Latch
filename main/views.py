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
from gcm import GCM
from PIL import Image
import apiai

@csrf_exempt
def social_login(request):
	if request.POST:
		fbid = request.POST['fbid']
		name = request.POST['name']
		try:
			user = User.objects.get(username = fbid)
			user_login = authenticate(username = fbid, password = fbid)
			login(request, user_login)
			response = {'status': 1, 'message': 'Login Successful', 'session_key': request.session.session_key}
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
			return JsonResponse({'status': 2, 'message': 'You will be redirected to where we can know you better! :D', 'session_key': request.session.session_key})

@csrf_exempt
def Register(request):
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
				if not len(contact) == 10:
					return JsonResponse({'status': 0, 'message': 'Kindly enter a valid phone number or email'})
				else:
					user = User.objects.create_user(username = contact, password = password)
					user.save()
					member = UserProfile()
					member.name = name
					member.user = user
					member.save()
					user_login = authenticate(username = contact, password = password)
					login(request, user_login)
					return JsonResponse({'status': 1, 'message': 'You will be redirected to where we can know you better! :D','session_key': request.session.session_key})
			else:
				user = User.objects.create_user(username = contact, password = password)
				user.save()
				member = UserProfile()
				member.name = name
				member.user = user
				member.save()
				user_login = authenticate(username = contact, password = password)
				login(request, user_login)
				return JsonResponse({'status': 1, 'message': 'You will be redirected to where we can know you better! :D','session_key': request.session.session_key})
		else:
			return JsonResponse({'status': 0, 'message': 'Your password did not match'})

@csrf_exempt
def login_user(request):
	if request.method == 'POST':
		contact = request.POST['contact']
		password = request.POST['password']
		user = authenticate(username = contact, password = password)

		if user:
			user_p = UserProfile.objects.get(user = user)
			login(request,user)
			return JsonResponse({'status':1, 'message': 'Successfully logged in', 'session_key': request.session.session_key, 'nick': user_p.nick_name, 'pic': user_p.dp_url})
			
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
			return JsonResponse(response)


		if nick in [x.nick_name for x in UserProfile.objects.all()]:	
			response = {'status': 0, 'message': 'This nick name is already registered. Kindly come up with something else.'}
		else:
			user_p = UserProfile.objects.get(user = user)
			user_p.nick_name = nick
			user_p.save()
			response = {'status': 1, 'message': 'Nick name was successfully saved'}

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
		return JsonResponse(response)

	user_p = UserProfile.objects.get(user = user)
	if 'getfromfb' in request.POST:
		fbdp = request.POST['fbdp']
		user_p.dp_url = fbdp
		user_p.save()
		response = {'status':1, 'message': 'dp has been successfully saved'}
	else:
		user_image = request.FILES.get('dpic')
		user_p.dp = user_image
		user_p.save()

	return JsonResponse({'status': 1, 'message': 'Successfully saved your profile pic'})


@csrf_exempt
def logout_user(request):
	logout(request)
	return JsonResponse({'status': 1, 'message': 'You have been successfully logged out'})

@csrf_exempt
def interests(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
			return JsonResponse(response)

		user_p = UserProfile.objects.get(user = user)
		interest_list = request.POST['interest'].split(',')
		for interest in interest_list[:-1]:
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
			return JsonResponse(response)

		lat = request.POST['lat']
		longitude = request.POST['longitude']
		user_p = UserProfile.objects.get(user = user)
		user_p.lat = lat
		user_p.longitude = longitude
		location_url = '''http://dev.virtualearth.net/REST/v1/Locations/%s,%s?key=Ai8hP_n0kTIQevn9nbLOFcKSqVHEicYiCfB81mPR_iWgDwjIdAIa7JOBktWjjmC3''' % (lat, longitude)
		json_data = json.load(urlopen(location_url))
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
		return JsonResponse(response)

	user_p = UserProfile.objects.get(user = user)
	lat = user_p.lat #test case
	longitude = user_p.longitude #test case
	location_url = '''http://dev.virtualearth.net/REST/v1/Locations/%s,%s?key=Ai8hP_n0kTIQevn9nbLOFcKSqVHEicYiCfB81mPR_iWgDwjIdAIa7JOBktWjjmC3''' % (lat, longitude)
	json_data = json.load(urlopen(location_url))
	locality = json_data['resourceSets'][0]['resources'][0]['address']['locality']

	groups = []
	for interest in user_p.interests.all():
		try:
			user_group = Group.objects.get(locality = locality, interest = interest)
			user_group.members.add(user_p)
			user_p.groups.add(user_group)
			user_group.save()
			user_p.save()
			Group_user.objects.create(user = user_p, group = user_group)
			# groups.append(user_group.name)
		except ObjectDoesNotExist:
			user_group = Group.objects.create(locality = locality, interest = interest)
			user_group_g = Group.objects.get(locality = locality, interest = interest)
			user_group_g.members.add(user_p)
			user_p.groups.add(user_group_g)
			user_group_g.save()
			user_p.save()
			Group_user.objects.create(user = user_p, group = user_group_g)
			# groups.append(user_group.name)

	response = {'status': 1, 'message': 'You have been added to the following groups'}
	return JsonResponse(response)

@csrf_exempt
def send_nearby(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
		return JsonResponse(response)

	user_p = UserProfile.objects.get(user = user)
	locality = user_p.locality
	nearby_users = UserProfile.objects.filter(locality = locality, anonymous = False)
	nearby_list = []
	for user in nearby_users:
		distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&destinations=%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, user.lat, user.longitude)
		json_data = json.load(urlopen(distance_url))
		b_distance = json_data['rows'][0]['elements'][0]['distance']['text']
		nearby_list.append({'nick': user.nick_name, 'distance': b_distance, 'lat': user.lat, 'longitude': user.longitude, 'pic': user.dp_url})
	nearby_users = nearby_list#sorted(nearby_list, itemgetter('distance'))

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
			return JsonResponse(response)

		user_p = UserProfile.objects.get(user = user)
		group = Group.objects.get(name = room_name)
		g_members_info = []
		if user_p in group.members.all():
			g_members = group.members.all()
			for user_g in g_members:
				# distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&destinations=%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, user_g.lat, user_g.longitude)
				# json_data = json.load(urlopen(distance_url))
				# distance = json_data['rows'][0]['elements'][0]['distance']['text']
				g_members_info.append({'nick': user_g.nick_name, 'pic': user_g.dp_url}) #= [x.nick_name for x in g_members]
			response = {'status': 1, 'members': g_members_info}
		else:
			response = {'status': 0, 'message': 'You are not allowed to view members of this group'}

		return JsonResponse(response)

@csrf_exempt
def start_chat_indi(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
			return JsonResponse(response)

		user_p = UserProfile.objects.get(user = user)
		user_c = UserProfile.objects.get(nick_name = request.POST['nick'])
		try:
			gr = Indi_group.objects.get(user1 = user_p, user2 = user_c)
		except ObjectDoesNotExist:
			try:
				gr = Indi_group.objects.get(user2 = user_p, user1 = user_c)
			except ObjectDoesNotExist:
				Indi_group.objects.create(user1 = user_p, user2 = user_c)
		return JsonResponse({'status': 1, 'message': 'Done'})

@csrf_exempt
def go_anonymous(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
		return JsonResponse(response)

	user_p = UserProfile.objects.get(user = user)
	if user_p.anonymous == True:
		user_p.anonymous = False
		user_p.save()
		response = {'status': 1, 'message': 'You are not anonymous any more'}
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
		return JsonResponse(response)

	user_p = UserProfile.objects.get(user = user)
	Group_ob = Group.objects.get(name = group_name)
	messages = Message.objects.filter(group = Group_ob)
	user_group = Group_user(user = user_p, group = Group_ob)
	msg_list = []
	for message in messages:
		msg_list.append({'message': message.message, 'nick_name': message.user.nick_name, 'time': message.timestamp})

	response = {'messages': msg_list}
	return JsonResponse(response)

@csrf_exempt
def node_api_message_group(request):
	print request.POST
	try:
        #Get User from sessionid
	        # post_string = request.POST['key']
	        # post_item_list = post_string.split(',')
		session_key = request.POST['session_key']
		print session_key
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
			return JsonResponse(response)
		print 1
        #Create message
		user_p = UserProfile.objects.get(user = user)
		group = Group.objects.get(name = request.POST['group_name'])
		try:
			message_create = Message.objects.create(message = request.POST['message'], user = user_p, group = group, msg_id = request.POST['msg_id'], timestamp = request.POST['time'])
 		except Exception, e:
 			return e
 		message = Message.objects.get(msg_id = request.POST['msg_id'])
 		print message
 		group.message.add(message)
		group.save()
		print 2
        #Once comment has been created post it to the chat channel
		# r = redis.StrictRedis(host='localhost', port=6379, db=0)
		# r.publish('chat_message', user_p.nick_name + ': ' + request.POST['message'] + ':' + datetime.now)
        
		return HttpResponse("Everything worked :)")
	except Exception, e:
		print e
		return e

@csrf_exempt
def node_api_message_user(request):
	print request.POST
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
			return JsonResponse(response)

        #Create message

		user_p = UserProfile.objects.get(user = user)
		user_c = UserProfile.objects.get(nick_name = request.POST['nick_name'])
		try:
			group = Indi_group.objects.get(user1 = user_p, user2 = user_c)
		except ObjectDoesNotExist:
			group = Indi_group.objects.get(user2 = user_p, user1 = user_c)

		try:
			message_create = Indi_msg.objects.create(message = request.POST['message'], user = user_p, group = group, msg_id = request.POST['msg_id'], timestamp = request.POST['time'])
		except Exception, e:
			return e
 		message = Indi_msg.objects.get(msg_id = request.POST['msg_id'])
 		group.message.add(message)
		group.save()
        #Once comment has been created post it to the chat channel
		# r = redis.StrictRedis(host='localhost', port=6379, db=0)
		# r.publish('chat_message', user_p.nick_name + ': ' + request.POST['message'] + ':' + datetime.now)
        
		return HttpResponse("Everything worked :)")
	except Exception, e:
		return e

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
			return JsonResponse(response)

		user_p = UserProfile.objects.get(user = user)
		groups = user_p.groups.all()
		group_list = []
		for group in groups:
			group_list.append({'group_name': group.name, 'pic': group.pic_url, 'members': group.members.all().count()})

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
			return JsonResponse(response)

		user_p = UserProfile.objects.get(user = user)
		i_group1 = Indi_group.objects.filter(user1 = user_p)
		i_group2 = Indi_group.objects.filter(user2 = user_p)

		# i_group = i_group1 + i_group2
		user_list = []
		for group in i_group1:
			try:
				distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&destinations=%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, group.user2.lat, group.user2.longitude)
				json_data = json.load(urlopen(distance_url))
				distance = json_data['rows'][0]['elements'][0]['distance']['text']
				user_list.append({'nick': group.user2.nick_name, 'pic': group.user2.dp_url, 'distance': distance})
			except:
				pass
		for group in i_group2:
			try:
				distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&destinations=%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, group.user1.lat, group.user1.longitude)
				json_data = json.load(urlopen(distance_url))
				distance = json_data['rows'][0]['elements'][0]['distance']['text']
				user_list.append({'nick': group.user1.nick_name, 'pic': group.user1.dp_url, 'distance': distance})
			except:
				pass

		return JsonResponse({'peers': user_list})

@csrf_exempt
def get_indi_chat(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		print uid
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	user_t = UserProfile.objects.get(nick_name = request.POST['nick'])
	try:
		indi_chat = Indi_group.objects.get(user1 = user_p, user2 = user_t)
	except ObjectDoesNotExist:
		print 1	
		try:
			indi_chat = Indi_group.objects.get(user2 = user_p, user1 = user_t)
		except ObjectDoesNotExist:
			print 2
			print user_p
			print user_t
			Indi_group.objects.create(user1 = user_p, user2 = user_t)
			print 3
			indi_chat = Indi_group.objects.get(user1 = user_p, user2 = user_t)

	messages = indi_chat.message.all()
	msg_list = []
	for message in messages:
		msg_list.append({'message': message.message, 'nick_name': message.user.nick_name, 'time': message.timestamp})

	response = {'messages': msg_list}
	return JsonResponse(response)

@csrf_exempt
def test_node_api(request):
	# if request.POST:
	# c = request.POST['comment']
	return JsonResponse({'message': 'c'})
	# else:
	# 	return JsonResponse({'partho_chutiya': request.session.session_key})

def test_chat(request):
	context = {'comments': ['asda'], 'partho_chutiya': request.session.session_key}
	return render(request, 'main/index.html', context)


# @login_required
# def suggest_rest
def test_img(request):
	user = UserProfile.objects.get(nick_name = 'varun_chut_part2')
	return 1

def get_profile(request):
	session_key = request.POST['session_key']
	session = Session.objects.get(session_key = session_key)
	uid = session.get_decoded().get('_auth_user_id')
	try:
		user = User.objects.get(pk=uid)
	except ObjectDoesNotExist:
		response = {'status':0, 'message':'Kindly login first'}
	user_p = UserProfile.objects.get(user = user)
	name = user_p.name
	nick = user_p.nick_name
	contact = user.username
	pic = user_p.dp_url

	return JsonResponse({'status':1, 'name': name, 'nick': nick, 'contact': contact, 'pic': pic})

# def get_device(request):
# 	if request.POST:
# 		session_key = request.POST['session_key']
# 		session = Session.objects.get(session_key = session_key)
# 		uid = session.get_decoded().get('_auth_user_id')
# 		try:
# 			user = User.objects.get(pk=uid)
# 		except ObjectDoesNotExist:
# 			response = {'status':0, 'message':'Kindly login first'}
# 		user_p = UserProfile.objects.get(user = user)
# 		device_id = Device_ID.objects.create(user = user_p, device_id = request.POST['device_id'])
# 		user_p.device_id.add(Device_ID.objects.get(device_id = request.POST['device_id']))
# 		user_p.save()
# 		return JsonResponse({'status': 1, 'message': 'successfully saved'})

@csrf_exempt
def indi_msg_notification(request):
	if request.POST:
		# if len(device_id) != 0:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		message = request.POST['message']
		user_c = UserProfile.objects.get(nick_name = request.POST['nick'])
		# timestamp = request.POST['time']
		gcm = GCM('AAAANbxRpq0:APA91bFgSsNBCJc2qubCF7--FQagNloimWcsRCMk_DezOPP88NvOO8ifcKilq_L1cmzaK9JHLXxXFV0a4nw3Lf-VHn1dxsxn5I0_6Gb7yNLtc-xRL0OUP7XrdfeEwkouS9kmfDkJCzYD')
		reg_ids = user_c.device_id.all()
		print reg_ids
		reg_ids_tmp = []
		for x in reg_ids:
			# for y in range(0, len(reg_ids)):
			try:
				reg_ids_tmp.append(x.device_id)
			except:
				pass
		notification_msg = '''New Message from %s''' % (user_p.nick_name)
		notification = {'title': 'New message', 'message': notification_msg, 'additionalData': {'isUser': 'isUser'}}
		response = gcm.json_request(registration_ids=reg_ids_tmp, data=notification)

		return JsonResponse({'status': 1, 'message': 'notification successfully sent', 'isUser': request.POST['isUser']})

@csrf_exempt
def device_id(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		device_id = Device_ID.objects.create(device_id = request.POST['device_id'], user = user_p)
		user_p.device_id.add(device_id)	
		response = {'status': 1, 'message': 'device id successfully saved'}
		return JsonResponse(response)
	else:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		device_id = user_p.device_id.all()
		return JsonResponse({'status': 1, 'device_id': device_id})		

@csrf_exempt
def group_msg_notification(request):
	if request.POST:
		# if len(device_id) != 0:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		message = request.POST['message']
		group = Group.objects.get(name = request.POST['group_name'])
		# timestamp = request.POST['time']
		gcm = GCM('AAAANbxRpq0:APA91bFgSsNBCJc2qubCF7--FQagNloimWcsRCMk_DezOPP88NvOO8ifcKilq_L1cmzaK9JHLXxXFV0a4nw3Lf-VHn1dxsxn5I0_6Gb7yNLtc-xRL0OUP7XrdfeEwkouS9kmfDkJCzYD')
		reg_ids = [x.device_id.all() for x in UserProfile.objects.filter(groups = group)]
		reg_ids_tmp = []
		for x in reg_ids:
			for y in range(0, len(reg_ids)):
				try:
					print x[y].device_id
					reg_ids_tmp.append(x[y].device_id)
				except:
					pass
		print reg_ids
		notification_msg = '''%s@%s: %s''' % (user_p.nick_name,group.name, request.POST['message'])
		notification = {'title': 'Latch', 'message': notification_msg, 'additionalData': {'isUser': request.POST['isUser']}}
		response = gcm.json_request(registration_ids=reg_ids_tmp, data=notification)

		return JsonResponse({'status': 1, 'message': 'notification successfully sent', 'isUser': request.POST['isUser']})

@csrf_exempt
def edit_profile(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		user_p.name = request.POST['name']
		if request.POST['nick'] not in [x.nick_name for x in UserProfile.objects.all()]:
			user_p.nick_name = request.POST['nick']
			user_p.contact = request.POST['contact']
			try:
				user_image = request.POST['pic']
				# img = Image.open(user_image)
				# img_final = img.resize((200/img.size[1]*img.size[0], 200), Image.ANTIALIAS)
				user_p.dp_url = user_image
			except:
				pass
			user_p.save()

			return JsonResponse({'status': 1, 'message': 'Changes have been successfully saved'})
		else:
			return JsonResponse({'status': 0, 'message': 'This nick is already registered.'})

@csrf_exempt
def change_password(request):
	if request.POST:
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
			return JsonResponse(response)

		user_auth = authenticate(username = user.username, password = request.POST['old_password'])
		if user_auth:
			if request.POST['new_password'] == request.POST['new_password_confirm']:
				user.set_password(request.POST['new_password'])
				user.save()
				response = {'status': 1, 'message': 'Your password has been successfully changed'}
			else:
				response = {'status': 0, 'message': 'your passwords did not match'}
		else:
			response = {'status': 0, 'message' : 'You are entering the wrong old password'}

		return JsonResponse(response)

@csrf_exempt
def chat_bot(request):
	if request.POST:
	#74c47b6322c6a40d4bef924bf238548c zomato api
		session_key = request.POST['session_key']
		session = Session.objects.get(session_key = session_key)
		uid = session.get_decoded().get('_auth_user_id')
		try:
			user = User.objects.get(pk=uid)
		except ObjectDoesNotExist:
			response = {'status':0, 'message':'Kindly login first'}
		user_p = UserProfile.objects.get(user = user)
		ai = apiai.ApiAI('819b6252e6c94b2ca7510d6d9da23574')
		request_ai = ai.text_request()
		request_ai.lang = 'en'
		request_ai.session_id = session_key
		query = request.POST['message']
		print query
		luis_url = '''https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=3dd64ac15d6049a7b4ac30f3eb591970&q=%s''' % (query)
		print luis_url
		request_ai.query = query
		print request_ai.query
		response = request_ai.getresponse()
		# json_response = json.dumps(response)
		bot_json = json.load(response)
		print bot_json
		try:
			intent_name = bot_json['result']['metadata']['intentName']
			bot_response = bot_json['result']['fulfillment']['speech']
		except:
			intent_name = 'Not eat'
			bot_response = bot_json['result']['fulfillment']['speech']
		if intent_name == 'Find me some places to eat near me':
			url = '''https://developers.zomato.com/api/v2.1/search?count=8&lat=%s&lon=%s&radius=%s&sort=rating&order=desc''' % (user_p.lat, user_p.longitude, 250000)
			headers = {'Accept': 'application/json','user-key': '74c47b6322c6a40d4bef924bf238548c'}
			req_rest = requests.get(url, headers=headers)
			# req_tmp = json.dumps(req_rest.text)
			restaurants_json = json.loads(req_rest.text)
			# print restaurants_json
			if restaurants_json['results_found'] != 0:
				rest_names = []
				rest_lat = []
				rest_longitude = []
				response_list = []
				for x in range(0,5):
					try:
						response_list.append({'name': restaurants_json['restaurants'][x]['restaurant']['name'], 'lat': restaurants_json['restaurants'][x]['restaurant']['location']['latitude'], 'long': restaurants_json['restaurants'][x]['restaurant']['location']['longitude']})
						rest_lat.append(restaurants_json['restaurants'][x]['restaurant']['location']['latitude'])
						rest_longitude.append(restaurants_json['restaurants'][x]['restaurant']['location']['longitude'])
						# response_list.append(restaurants_json['restaurants'][x]['restaurant']['location']['latitude'])
						# response_list.append(restaurants_json['restaurants'][x]['restaurant']['location']['longitude'])
					except:
						response_list.append({'name': restaurants_json['restaurants'][x]['restaurant']['name'], 'lat': restaurants_json['restaurants'][x]['restaurant']['location']['locality'], 'long': restaurants_json['restaurants'][x]['restaurant']['location']['city']})
						rest_lat.append(restaurants_json['restaurants'][x]['restaurant']['location']['latitude'])
						rest_longitude.append(restaurants_json['restaurants'][x]['restaurant']['location']['longitude'])
						# response_list.append(restaurants_json['restaurants'][x]['location']['locality'])
						# response_list.append(restaurants_json['restaurants'][x]['location']['city'])
				distance_url = '''https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=%s,%s&destinations=%s,%s|%s,%s|%s,%s|%s,%s|%s,%s&key=AIzaSyC0NDPBi5LbvZcF8J5g98uKAyMyoAojQBE''' % (user_p.lat, user_p.longitude, rest_lat[0], rest_longitude[0],rest_lat[1], rest_longitude[1],rest_lat[2], rest_longitude[2],rest_lat[3], rest_longitude[3],rest_lat[4], rest_longitude[4])
				distance_tmp = requests.get(distance_url)
				distance_json = json.loads(distance_tmp.text)
				rest_distance = []
				for x in range(0,5):
					try:
						response_list[x]['distance'] = distance_json['rows'][0]['elements'][x]['distance']['text']
					except:
						response_list[x]['distance'] = 'null'
					response_list[x]['restaurants'] = {}
					response_list[x]['restaurants']['address'] = restaurants_json['restaurants'][x]['restaurant']['location']['address']
					response_list[x]['restaurants']['locality'] = restaurants_json['restaurants'][x]['restaurant']['location']['locality']
					response_list[x]['restaurants']['city'] = restaurants_json['restaurants'][x]['restaurant']['location']['city']
					response_list[x]['id'] = restaurants_json['restaurants'][x]['restaurant']['id']

				response = {'status': 1, 'restaurants': response_list, 'msg_id': request.POST['msg_id'], 'time': request.POST['time'], 'nick': request.POST['nick_name'], 'message': 'Here I found some awesome places to give your stomach a treat near you. Click on the names to know more about them :D'}
				return JsonResponse(response)
			else:
				response = {'status': 0, 'message': 'Sorry I couldn\'t find any place nearby to eat.', 'msg_id': request.POST['msg_id'], 'time': request.POST['time'], 'nick': request.POST['nick_name']}
				return JsonResponse(response)
		elif intent_name == "find hotels near me":
			hotel_url = '''https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+%s&key=AIzaSyATE-DjQxRSzwzn9OreHh_PvEkHQlVm_Hg''' % (user_p.locality)
			response_list = []
			hotel_tmp = requests.get(hotel_url)
			hotel_json = json.loads(hotel_tmp.text)
			for hotel in hotel_json['results']:
				try:
					response_list.append({'name': hotel['name'], 'lat': hotel['geometry']['location']['lat'], 'lng': hotel['geometry']['location']['lng'], 'rating': hotel['rating'], 'address': hotel['formatted_address'], 'place_id': hotel[place_id]})
				except:
					response_list.append({'name': hotel['name'], 'lat': hotel['geometry']['location']['lat'], 'lng': hotel['geometry']['location']['lng'], 'rating': 'none', 'address': hotel['formatted_address'], 'place_id': hotel[place_id]})
			return JsonResponse({'status' :1, 'hotels': response_list, 'message': 'here are some hotels for you', 'msg_id': request.POST['msg_id'], 'time': request.POST['time'], 'nick': request.POST['nick_name']})
		else:
			response = {'status': 1, 'message': bot_response, 'msg_id': request.POST['msg_id'], 'time': request.POST['time'], 'nick': request.POST['nick_name']}
			return JsonResponse(response)

@csrf_exempt
def get_reviews_restaraunt(request):
	res_id = request.POST['id']
	url = '''https://developers.zomato.com/api/v2.1/reviews?res_id=%s''' % (res_id)
	headers = {'Accept': 'application/json','user-key': '74c47b6322c6a40d4bef924bf238548c'}
	req_rest = requests.get(url, headers=headers)
	restaurants_json = json.loads(req_rest.text)
	print restaurants_json
	response_list = []
	for x in range(0, min(restaurants_json['reviews_count'], 3)):
		response_list.append({'rating': restaurants_json['user_reviews'][x]['review']['rating'], 'review': restaurants_json['user_reviews'][x]['review']['review_text']})
		print response_list
	return JsonResponse({'reviews': response_list})

@csrf_exempt
def get_reviews_hotels(request):
	place_id = request.POST['place_id']
	url = '''https://maps.googleapis.com/maps/api/place/details/json?placeid=%s&key=AIzaSyATE-DjQxRSzwzn9OreHh_PvEkHQlVm_Hg'''% (place_id)
	req_hotel = requests.get(url)
	hotel_review_json = json.loads(req_hotel.text)
	review_list = hotel_review_json['result']['reviews']
	for review in range(0, len(review_list), 3):
		response_list.append({'rating': review_list[review]['rating'], 'review': review_list[review]['text']})
	return JsonResponse({'reviews': response_list})