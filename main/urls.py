from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^test_room/(?P<label>[\w-]{,50})/$', views.test_room, name='chat_room'),
    url(r'^accounts/login/social/$', views.social_login, name='social_login'),
    url(r'^accounts/login/$', views.login_user, name='login'),
    url(r'^user/logout/$', views.logout_user, name='logout'),
    url(r'^chat/test/$', views.test_chat, name='test_chat'),
    url(r'^accounts/register/$', views.Register, name='Register'),
    url(r'^accounts/test/$', views.test, name='test'),
    url(r'^user/nick/$', views.nick_name, name='nick_name'),
    url(r'^user/interests/$', views.interests, name='interests'),
    url(r'^user/add_chatroom/$', views.add_to_chatroom, name='add_chatroom'),
    url(r'^user/get_chat_list/$', views.user_users, name='user_users'),
    url(r'^user/get_groups/$', views.user_groups, name='user_groups'),
    url(r'^user/interests/$', views.interests, name='interests'),
    url(r'^room/(?P<room_name>[\w-]{,50})/get_members/$', views.get_members_chatroom, name='get_members_chatroom'),
    url(r'^user/anonymous/$', views.go_anonymous, name='anonymous'),

    url(r'^room/(?P<room_name>[\w-]{,50})/$', views.get_chatroom, name='get_chatroom'),
    # url(r'^room/(?P<group_name>[\w-]{,50})/message_send/$', views.node_api_message, name='node_api_message'),
    url(r'^node_api/$', views.test_node_api, name='node_api_message')
]