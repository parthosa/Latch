# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_auto_20170202_1019'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='dp',
            field=models.ImageField(null=True, upload_to=b'dps'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='dp_url',
            field=models.SlugField(max_length=500, null=True),
        ),
    ]
