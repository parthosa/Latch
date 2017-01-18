from django.contrib import admin
from .models import *
admin.site.register(UserProfile)
admin.site.register(Interest)
admin.site.register(Group)
admin.site.register(Message)

# Register your models here.
