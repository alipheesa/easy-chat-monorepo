# Generated by Django 4.2.3 on 2023-10-23 14:01

import chat.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_alter_group_is_public'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='icon',
            field=models.ImageField(default=chat.models.random_group_icon, upload_to='group_icons'),
        ),
        migrations.AlterField(
            model_name='group',
            name='wall_image',
            field=models.ImageField(default=chat.models.random_user_wallpaper, upload_to='group_wallpapers'),
        ),
    ]