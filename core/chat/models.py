import random

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_lifecycle import (
    AFTER_DELETE,
    AFTER_SAVE,
    AFTER_UPDATE,
    LifecycleModel,
    hook,
)
from rest_framework.exceptions import ValidationError

User = get_user_model()


def get_random_default_media_url(folder, end, start=1, extension='jpg', padded=True):
    index = random.randint(start, end)
    index = f'{index:03}' if padded else index
    media_url = f'default/{folder}/{index}.{extension}'
    return media_url


def random_user_icon():
    return get_random_default_media_url('user_icon', 383, extension='gif')


def random_user_wallpaper():
    return get_random_default_media_url('user_wallpaper', 8, extension='jpg')


def random_group_icon():
    return get_random_default_media_url('group_icon', 3, extension='jpg')


class UserProfile(models.Model):
    class Gender(models.TextChoices):
        MALE = 'Male', 'Male'
        FEMALE = 'Female', 'Female'
        ATTACK_HELICOPTER = 'Attack Helicopter', 'Attack Helicopter'
        UNDEFINED = 'Undefined', 'Undefined'

    class Status(models.TextChoices):
        ONLINE = 'Online', 'Online'
        OFFLINE = 'Offline', 'Offline'
        SLEEPING = 'Sleeping', 'Sleeping'
        BUSY = 'Busy', 'Busy'

    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=45)
    gender = models.CharField(default=Gender.UNDEFINED, max_length=35, choices=Gender.choices)
    bio = models.CharField(max_length=500, blank=True)

    date_last_visit = models.DateTimeField(default=timezone.now)
    date_joined = models.DateTimeField(auto_now_add=True)

    icon = models.ImageField(default=random_user_icon, upload_to='user_icons')
    wallpaper = models.ImageField(default=random_user_wallpaper, upload_to='user_wallpapers')

    is_online = models.BooleanField(default=False)
    status = models.CharField(default=Status.OFFLINE, max_length=35, choices=Status.choices)
    default_status = models.CharField(default=Status.ONLINE, max_length=35, choices=Status.choices)

    def mark_online(self):
        self.is_online = True
        self.status = self.default_status
        self.save()

    def mark_offline(self):
        self.is_online = False
        self.status = self.Status.OFFLINE
        self.save()

    def __str__(self):
        return f'profile of "{self.user}"'


class Group(LifecycleModel):
    class Category(models.TextChoices):
        GAMING = 'Gaming', 'Gaming'
        MUSIC = 'Music', 'Music'
        EDUCATION = 'Education', 'Education'
        SCIENCE = 'Science', 'Science'
        ENTERTAINMENT = 'Entertainment', 'Entertainment'
        UNDEFINED = 'Undefined', 'Undefined'

    name = models.CharField(max_length=35, unique=True)
    icon = models.ImageField(default=random_group_icon, upload_to='group_icons')
    wall_image = models.ImageField(default=random_user_wallpaper, upload_to='group_wallpapers')
    category = models.CharField(default=Category.UNDEFINED, max_length=35, choices=Category.choices)
    description = models.CharField(max_length=140, blank=True, null=True)
    is_public = models.BooleanField(default=True)
    participants = models.ManyToManyField(User, through='Participant')

    class Meta:
        permissions = (
            ('invite_in_group', 'Can send invites to group'),
            ('assign_roles_in_group', 'Can assign group roles'),
        )

    def has_participant(self, user):
        return self.participants.filter(pk=user.id).exists()

    @hook(AFTER_SAVE)
    @hook(AFTER_DELETE)
    @hook(AFTER_UPDATE)
    def invalidate_cache(self):
        cache.delete(f'public_groups_{self.category}')

    def __str__(self):
        return f'group "{self.name}"'


class GroupRole(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(max_length=35)

    class Meta:
        unique_together = ('group', 'name')

    def __str__(self):
        return f'role "{self.name}" in "{self.group.name}"'


class Topic(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(default='General', max_length=22)

    class Meta:
        unique_together = ('group', 'name')

    def __str__(self):
        return f'topic "{self.name}" in "{self.group.name}"'


class Room(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    name = models.CharField(default='home', max_length=22)
    description = models.CharField(max_length=100, blank=True, null=True)
    participants = models.ManyToManyField('Participant', through='RoomParticipant')

    class Meta:
        unique_together = ('topic', 'name')

    def is_read_by_user(self, user):
        # participant = self.participants.through
        participant = get_object_or_404(RoomParticipant, participant__user=user, room=self.id)
        # last_message = Message.objects.filter(room=self.id).last()
        last_message = self.message_set.last()
        if not last_message:
            return True
        if not participant.last_read_message:
            return False
        if participant.last_read_message == last_message:
            return True
        else:
            return False

    def __str__(self):
        return f'room "{self.name}" in "{self.topic.name}" (group "{self.topic.group.name}"))'


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.CharField(max_length=1024)
    reply_to = models.ForeignKey('self', blank=True, null=True, on_delete=models.SET_NULL)
    is_hidden = models.BooleanField(default=False)
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'message "{self.text}" from {self.sender} in {self.room}'


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.ForeignKey(GroupRole, on_delete=models.SET_NULL, blank=True, null=True)
    is_read = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')

    def clean(self):
        super().clean()

        if self.role and self.role.group != self.group:
            raise ValidationError("Group role must belong to the participant's group.")

    def __str__(self):
        return f'participant "{self.user.username}" in "{self.group.name}"'


class RoomParticipant(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    last_read_message = models.ForeignKey(Message, on_delete=models.SET_NULL, blank=True, null=True)

    def mark_all_as_read(self):
        self.last_read_message = Message.objects.filter(room=self.room).last()
        self.save()

    class Meta:
        unique_together = ('participant', 'room')

    def __str__(self):
        return f'room participant "{self.participant.user.username}" in "{self.room.name}"'
