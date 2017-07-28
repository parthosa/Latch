# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20170127_1144'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='pic',
            field=models.ImageField(null=True, upload_to=b'dps'),
            preserve_default=True,
        ),
    ]
