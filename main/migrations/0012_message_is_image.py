# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_userprofile_sos'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='is_image',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
