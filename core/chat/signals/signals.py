from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from chat.models import Group, GroupRole, Participant, Room, RoomParticipant, Topic

User = get_user_model()


@receiver(post_save, sender=Group)
def create_group_topic(sender, instance, created, **kwargs):
    if created:
        Topic.objects.create(group=instance).save()


@receiver(post_save, sender=Group)
def create_group_role(sender, instance, created, **kwargs):
    if created:
        GroupRole.objects.create(group=instance, name='User').save()


@receiver(post_save, sender=Topic)
def create_topic_room(sender, instance, created, **kwargs):
    if created:
        Room.objects.create(topic=instance).save()


@receiver(post_save, sender=Room)
def create_room_participants_for_new_room(sender, instance, created, **kwargs):
    if created:
        participants = Participant.objects.filter(group__id=instance.topic.group.id)
        for participant in participants:
            RoomParticipant.objects.create(participant=participant, room=instance)


@receiver(post_save, sender=Participant)
def create_room_participants_for_new_participant(sender, instance, created, **kwargs):
    if created:
        rooms = Room.objects.filter(topic__group__id=instance.group.id)
        for room in rooms:
            RoomParticipant.objects.create(participant=instance, room=room)
