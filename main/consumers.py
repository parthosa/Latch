from channels import Group
from channels.sessions import channel_session
from .models import Group as chat_room
import logging
from .models import Interest, UserProfile, Message

# log = logging.getLogger(__name__)

@channel_session
def ws_connect(message):
	print message['path']
	label = message['path'].strip('/').split('/')[2]
	try:
		room = chat_room.objects.get(name = label)
	except: 
		print 23
		interest = Interest.objects.get(name = label.split('_')[1])
		room = chat_room.objects.create(locality = label.split('_')[0], interest = interest)
	Group('chat-' + label, channel_layer=message.channel_layer).add(message.reply_channel)

	print Group(label).name
	message.channel_session['room'] = room.name
	print message.channel_session['room']

@channel_session
def ws_receive(message):
    label = message.channel_session['room']
    room = chat_room.objects.get(label=label)
    data = json.loads(message['text'])
    m = room.message.create(message=data['message'], group = room, user = request.user)
    Group(label).send({'text': json.dumps(m.as_dict())})
	# text = message.content.get('text')
	# print message['path']
	# if text:
	# 	message.reply_channel.send({'text': "you said {}".format(text)})

# @channel_session
# def ws_disconnect(message):
# 	# print 12
#     label = message.channel_session['room']
#     Group(label).discard(message.reply_channel)
#     print 12
