# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20170218_2155'),
    ]

    operations = [
        migrations.CreateModel(
            name='User_group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30, null=True)),
                ('pic', models.ImageField(null=True, upload_to=b'dps')),
                ('pic_url', models.SlugField(max_length=500, null=True)),
                ('uid', models.CharField(max_length=40, null=True)),
                ('created_by', models.ForeignKey(related_name=b'created_by', to='main.UserProfile', null=True)),
                ('members', models.ManyToManyField(related_name=b'manual_group_members', null=True, to='main.UserProfile')),
                ('message', models.ManyToManyField(related_name=b'manual_group_message', null=True, to='main.Message')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='contact_number',
            field=models.BigIntegerField(unique=True, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='userprofile',
            name='groups_manual',
            field=models.ManyToManyField(related_name=b'user_group_manual', to='main.User_group'),
            preserve_default=True,
        ),
    ]
