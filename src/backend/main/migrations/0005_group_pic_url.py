# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_group_pic'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='pic_url',
            field=models.SlugField(max_length=500, null=True),
            preserve_default=True,
        ),
    ]
