from django.contrib import admin
from .models import *
admin.site.register(UserProfile)
admin.site.register(Interest)
admin.site.register(Group)
admin.site.register(Message)
admin.site.register(Indi_group)
admin.site.register(Indi_msg)
admin.site.register(Group_user)
admin.site.register(Device_ID)
admin.site.register(User_group)

# Register your models here.
