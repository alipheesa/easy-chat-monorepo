# Generated by Django 4.2.3 on 2023-10-10 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_alter_userprofile_icon_alter_userprofile_wallpaper'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='is_public',
            field=models.BooleanField(default=True),
        ),
    ]
