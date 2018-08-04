# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_group_pic_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indi_msg',
            name='timestamp',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=models.CharField(max_length=100),
        ),
    ]
