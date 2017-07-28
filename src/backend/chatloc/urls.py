from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from . import settings
# from . import settings

urlpatterns =[
    # Examples:
    # url(r'^$', 'chatloc.views.home', name='home'),
    url(r'^main/', include('main.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
]
