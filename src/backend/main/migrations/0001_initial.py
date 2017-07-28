# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('locality', models.CharField(max_length=100, null=True)),
                ('name', models.SlugField(max_length=150, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Group_user',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time_joined', models.DateTimeField(default=datetime.datetime.now)),
                ('time_left', models.DateTimeField(default=datetime.datetime.now)),
                ('group', models.ForeignKey(related_name=b'user_group_time', to='main.Group', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Interest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('group', models.ForeignKey(related_name=b'message_group', to='main.Group')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100, null=True)),
                ('nick_name', models.CharField(max_length=50, unique=True, null=True)),
                ('fbid', models.CharField(max_length=30, unique=True, null=True)),
                ('anonymous', models.BooleanField(default=False)),
                ('timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('lat', models.CharField(max_length=30, null=True)),
                ('longitude', models.CharField(max_length=30, null=True)),
                ('locality', models.CharField(max_length=100, null=True)),
                ('dp', models.ImageField(null=True, upload_to=b'dps')),
                ('dp_url', models.SlugField(max_length=500, null=True)),
                ('groups', models.ManyToManyField(related_name=b'user_group', to='main.Group')),
                ('interests', models.ManyToManyField(related_name=b'user_interest', to='main.Interest')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='message',
            name='user',
            field=models.ForeignKey(related_name=b'user_message', to='main.UserProfile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group_user',
            name='user',
            field=models.ForeignKey(related_name=b'group_user_time', to='main.UserProfile', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group',
            name='interest',
            field=models.ForeignKey(related_name=b'group_interest', to='main.Interest', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(related_name=b'members', null=True, to='main.UserProfile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group',
            name='message',
            field=models.ManyToManyField(related_name=b'group_message', null=True, to='main.Message'),
            preserve_default=True,
        ),
    ]
