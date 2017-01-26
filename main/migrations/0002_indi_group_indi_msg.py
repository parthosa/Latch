# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Indi_group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, null=True)),
                ('message', models.ManyToManyField(related_name=b'indi_msgs', to='main.Message')),
                ('user1', models.ForeignKey(related_name=b'indi_user1', to='main.UserProfile', null=True)),
                ('user2', models.ForeignKey(related_name=b'indi_user2', to='main.UserProfile', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Indi_msg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(default=datetime.datetime.now)),
                ('group', models.ForeignKey(related_name=b'message_indi_group', to='main.Indi_group')),
                ('user', models.ForeignKey(related_name=b'user_indi_msg', to='main.UserProfile')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
