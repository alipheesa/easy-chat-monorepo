from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from chat.models import Group, Message, Participant, Room, RoomParticipant, UserProfile
from chat.serializers import MessageSerializer


@database_sync_to_async
def mark_user_online(user):
    UserProfile.objects.get(user=user).mark_online()


@database_sync_to_async
def mark_user_offline(user):
    UserProfile.objects.get(user=user).mark_offline()


# Deprecated
@database_sync_to_async
def is_room_member(user, room_id):
    return Participant.objects.filter(user=user, group__topic_set__room_set=room_id).exists()


@database_sync_to_async
def is_room_in_group(room_id, group_id):
    return Room.objects.filter(id=room_id, topic__group=group_id).exists()


@database_sync_to_async
def is_group_member(user, group_id):
    return Participant.objects.filter(user=user, group=group_id).exists()


@database_sync_to_async
def get_user_group_id_list(user):
    return [x.group.pk for x in Participant.objects.filter(user=user)]


@database_sync_to_async
def get_user_default_status(user):
    return UserProfile.objects.get(user=user).default_status


@database_sync_to_async
def mark_room_messages_as_read(user, room):
    RoomParticipant.objects.get(participant__user_id=user.id, room_id=room.id).mark_all_as_read()


@database_sync_to_async
def serialize_message(message):
    return MessageSerializer(message, context={}).data


# Deprecated
# @database_sync_to_async
# def get_user_groups(user, pk=False, serialize=True):
#     if pk:
#         user = models.User.objects.get(id=user)
#
#     serializer = serializers.GroupSerializer
#     queryset = user.group_set.all()
#
#     if serialize:
#         return serializer(queryset, many=True).data
#
#     return queryset
#
#
# @database_sync_to_async
# def get_group_rooms(group, pk=False, serialize=True):
#     if pk:
#         group = models.Group.objects.get(id=group)
#
#     serializer = serializers.RoomSerializer
#     queryset = group.room_set.all()
#
#     if serialize:
#         return serializer(queryset, many=True).data
#
#     return queryset
#
#
# @database_sync_to_async
# def get_room_messages(room, pk=False, serialize=True):
#     if pk:
#         room = models.Room.objects.get(id=room)
#
#     serializer = serializers.MessageSerializer
#     queryset = room.message_set.all()
#
#     if serialize:
#         return serializer(queryset, many=True).data
#
#     return queryset


class GroupConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.group_list = set()
        self.group = None
        self.room = None

    async def connect(self):

        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return await self.close()

        await self.accept()

        await mark_user_online(self.user)

        self.group_list = await get_user_group_id_list(self.user)
        user_default_status = await get_user_default_status(self.user)

        for group_id in self.group_list:
            await self.channel_layer.group_add(
                f'group-notifications-{group_id}',
                self.channel_name
            )
            await self.channel_layer.group_send(
                f'group-{group_id}',
                {
                    'type': 'user.status',
                    'user': self.user.pk,
                    'status': user_default_status
                }
            )

    async def disconnect(self, code):

        # mark user as offline
        await mark_user_offline(self.user)

        if self.room:
            await self.room_disconnect()

        if self.group:
            await self.group_disconnect()

        for group_id in self.group_list:
            await self.channel_layer.group_discard(
                f'group-notifications-{group_id}',
                self.channel_name
            )
            await self.channel_layer.group_send(
                f'group-{group_id}',
                {
                    'type': 'user.status',
                    'user': self.user.pk,
                    'status': UserProfile.Status.OFFLINE
                }
            )

        await super().disconnect(code)

    async def receive_json(self, content, **kwargs):
        event_type = content.get('type')
        if event_type == 'group.connect':
            await self.group_connect(content)
        elif event_type == 'group.disconnect':
            await self.group_disconnect()
        elif event_type == 'group.join':
            await self.group_join(content)
        elif event_type == 'group.leave':
            await self.group_leave(content)
        elif event_type == 'group.notifications.message':
            await self.group_notifications_message(content)
        elif event_type == 'room.connect':
            await self.room_connect(content)
        elif event_type == 'room.disconnect':
            await self.room_disconnect()
        elif event_type == 'message.send':
            await self.message_send(content)
        elif event_type == 'user.message':
            await self.user_message(content)
        elif event_type == 'user.status':
            await self.user_status(content)
        elif event_type == 'typing.status':
            await self.typing_status(content)
        elif event_type == 'change.typing.status':
            await self.change_typing_status(content)

    async def group_join(self, content):
        group_id = content.get('group_id')

        if not group_id:
            return

    async def group_leave(self, content):
        pass

    async def group_connect(self, content):

        group_id = content.get('group_id')

        if not group_id:
            # Group with id {group_id} doesn't exist.
            return

        if not await is_group_member(self.user, group_id):
            # User is not member of requested group.
            return

        try:
            group = await database_sync_to_async(Group.objects.get)(id=group_id)
        except Group.DoesNotExist:
            return

        user_default_status = await get_user_default_status(self.user)

        if not self.group:
            await self.send_json({
                'type': 'user.status',
                'user': self.user.pk,
                'status': user_default_status
            })
        elif self.group:
            await self.group_disconnect()

        self.group = group

        await self.channel_layer.group_add(
            f'group-{self.group.pk}',
            self.channel_name
        )

        await self.send_json({
            'type': 'system.message',
            'text': f'connected to group {group_id}'
        })


    async def group_disconnect(self):

        if not self.group:
            # Unable to disconnect from group websocket due to self.group is being None.
            return

        if self.room:
            await self.room_disconnect()

        await self.channel_layer.group_discard(
            f'group-{self.group.pk}',
            self.channel_name
        )

        await self.send_json({
            'type': 'system.message',
            'text': f'disconnected from group {self.group.id}'
        })

        self.group = None

    async def room_connect(self, content):

        room_id = content.get('room_id')

        if not self.group:
            # Unable to connect to room websocket due to self.group being None.
            return

        if self.room:
            await self.room_disconnect()
            if self.room:
                # Unable to connect to room websocket due to self.room not being None.
                return

        if not room_id:
            # Group with id {room_id} doesn't exist.
            return

        if not await is_room_in_group(room_id, int(self.group.pk)):
            # Room is not in accessed group.
            return

        try:
            self.room = await database_sync_to_async(Room.objects.get)(id=room_id)
        except Room.DoesNotExist:
            return

        await self.channel_layer.group_add(
            f'room-{self.room.pk}',
            self.channel_name
        )

        await self.send_json({
            'type': 'system.message',
            'text': f'connected to room {room_id}'
        })

    async def room_disconnect(self):

        if not self.room:
            # Unable to disconnect from room websocket due to self.room is being None. Connect to group first.
            return

        if not self.group:
            # This shouldn't happen
            raise Exception('Disconnecting from room despite not being connected to group')

        await self.channel_layer.group_discard(
            f'room-{self.room.pk}',
            self.channel_name
        )

        await mark_room_messages_as_read(self.user, self.room)

        await self.send_json({
            'type': 'system.message',
            'text': f'disconnected from room {self.room.pk}'
        })

        self.room = None

    async def message_send(self, content):

        text = content.get('text')

        if not self.room:
            # Can't send message due to self.room being None.
            return

        if not text:
            # Message is empty.
            return

        message = await database_sync_to_async(Message.objects.create)(
            sender=self.user,
            room=self.room,
            text=text,
            reply_to=None,
        )

        await self.channel_layer.group_send(
            f'room-{self.room.pk}',
            {
                'type': 'user.message',
                'message': await serialize_message(message)
            }
        )

        await self.channel_layer.group_send(
            f'group-notifications-{self.group.pk}',
            {
                'type': 'group.notifications.message',
                'group_id': self.group.pk,
                'room_id': self.room.pk
            }
        )

    async def change_typing_status(self, content):

        if not self.group or not self.room:
            # User is not connected to group or room
            return

        is_typing = content.get('is_typing')

        if is_typing is None:
            # Invalid message data
            return

        profile = await database_sync_to_async(UserProfile.objects.get)(user=self.user)

        await self.channel_layer.group_send(
            f'room-{self.room.pk}',
            {
                'type': 'typing.status',
                'user': self.user.pk,
                'name': profile.full_name,
                'is_typing': is_typing
            }
        )

    async def user_message(self, content):
        await self.send_json(content)

    async def user_status(self, content):
        await self.send_json(content)

    async def typing_status(self, content):
        await self.send_json(content)

    async def system_message(self, content):
        await self.send_json(content)

    async def group_notifications_message(self, content):
        await self.send_json(content)


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        pass

    async def disconnect(self, code):
        pass

    async def receive_json(self, content, **kwargs):
        pass
