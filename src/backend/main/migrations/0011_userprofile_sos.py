# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_auto_20170722_0929'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='sos',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
    ]
