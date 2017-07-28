# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_indi_group_indi_msg'),
    ]

    operations = [
        migrations.AddField(
            model_name='indi_msg',
            name='msg_id',
            field=models.CharField(max_length=100, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='message',
            name='msg_id',
            field=models.CharField(max_length=100, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='indi_group',
            name='message',
            field=models.ManyToManyField(related_name=b'indi_msgs', to=b'main.Indi_msg'),
        ),
    ]
