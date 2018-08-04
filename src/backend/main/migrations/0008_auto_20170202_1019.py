# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_auto_20170131_1104'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='dp',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='dp_url',
            field=models.TextField(null=True),
        ),
    ]
