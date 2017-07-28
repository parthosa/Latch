# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20170131_0840'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device_ID',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('device_id', models.CharField(max_length=200)),
                ('user', models.ForeignKey(related_name=b'device_user', to='main.UserProfile')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='device_id',
            field=models.ManyToManyField(related_name=b'user_devices', to='main.Device_ID'),
            preserve_default=True,
        ),
    ]
