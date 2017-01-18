from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^(?P<label>[\w-]{,50})/$', views.test_room, name='chat_room'),
]