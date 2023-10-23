from django.contrib.auth import get_user_model
from django.db.models import BooleanField as DjangoBooleanField
from django.db.models import Case, Count, F, OuterRef, Q, Subquery, When
from rest_framework.fields import BooleanField, IntegerField, SerializerMethodField
from rest_framework.serializers import ModelSerializer

from chat.models import (
    Group,
    GroupRole,
    Message,
    Participant,
    Room,
    RoomParticipant,
    Topic,
    UserProfile,
)
from config import HOST, MEDIA_FOLDER_NAME, PORT


class UserProfileUpdateSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['icon', 'full_name', 'status', 'wallpaper', 'bio']


class GroupUpdateSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'icon', 'wall_image', 'category', 'description', 'is_public']


class UserProfileSerializer(ModelSerializer):
    icon = SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['icon', 'full_name', 'status', 'wallpaper', 'bio', 'date_joined']

    def get_icon(self, instance):
        return f'http://{HOST}:{PORT}/{MEDIA_FOLDER_NAME}/{instance.icon}'


class UserSerializer(ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'profile']


class MessageSerializer(ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'room', 'text', 'reply_to', 'date_sent']

class MessageSearchSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'room', 'text', 'reply_to', 'date_sent']


class RoomParticipantSerializer(ModelSerializer):
    last_read_message = MessageSerializer()
    unread_count = SerializerMethodField()

    def get_unread_count(self, instance):
        last_read_message = instance.last_read_message
        if last_read_message:
            return Message.objects.filter(room=instance.room, date_sent__gt=last_read_message.date_sent).count()
        else:
            return Message.objects.filter(room=instance.room).count()

    class Meta:
        model = RoomParticipant
        fields = ['unread_count', 'last_read_message']


class RoomSerializerBase(ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'topic']


class RoomSerializer(RoomSerializerBase):
    messages = MessageSerializer(source='message_set', many=True, read_only=True)
    participant = SerializerMethodField()

    def get_participant(self, instance):
        user = self.context['request'].user
        room_participant = RoomParticipant.objects.filter(room=instance, participant__user=user).first()
        serializer = RoomParticipantSerializer(room_participant)
        return serializer.data

    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'messages', 'participant']


class RoomSerializerTopic(RoomSerializerBase):
    participant = SerializerMethodField()

    def get_participant(self, instance):
        user = self.context['request'].user
        room_participant = RoomParticipant.objects.filter(room=instance, participant__user=user).first()
        serializer = RoomParticipantSerializer(room_participant)
        return serializer.data

    class Meta:
        model = Room
        fields = ['id', 'name', 'topic', 'description', 'participant']


class TopicCreateSerializer(ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'group']


class TopicSerializer(ModelSerializer):
    rooms = RoomSerializerTopic(source='room_set', many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'group', 'rooms']


class PublicGroupSerializer(ModelSerializer):
    participant_count = IntegerField()
    online_count = IntegerField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'icon', 'wall_image', 'description', 'participant_count', 'online_count']

    @staticmethod
    def prefetch_related(queryset):
        queryset = queryset.defer('is_public', 'category')
        queryset = queryset.annotate(participant_count=Count('participants'))
        queryset = queryset.annotate(
            online_count=Count('participants__profile', filter=Q(participants__profile__is_online=True))
        )
        return queryset


class GroupSerializer(ModelSerializer):
    is_read = BooleanField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'icon', 'is_read']

    @staticmethod
    def prefetch_related(queryset, user):
        last_room_message_subquery = Subquery(
            Message.objects.filter(room=OuterRef('pk')).order_by('-id').values('id')[:1]
        )

        last_read_message_subquery = Subquery(
            RoomParticipant.objects.filter(
                room=OuterRef('pk'), participant__user=user
            ).values('last_read_message')
        )

        queryset = queryset.alias(last_room_message=last_room_message_subquery)
        queryset = queryset.alias(last_read_message=last_read_message_subquery)

        queryset = queryset.annotate(
            is_read=Case(
                When(last_room_message__isnull=True, then=True),
                When(last_room_message=F('last_read_message'), then=True),
                default=False,
                output_field=DjangoBooleanField(),
            ),
        )

        return queryset


class RoleSerializer(ModelSerializer):
    class Meta:
        model = GroupRole
        fields = ['id', 'name']


class ParticipantSerializer(ModelSerializer):
    user = UserSerializer()
    role = RoleSerializer()

    class Meta:
        model = Participant
        fields = ['id', 'user', 'role']


class GroupDetailSerializer(ModelSerializer):
    topics = TopicSerializer(source='topic_set', many=True, read_only=True)
    participants = ParticipantSerializer(source='participant_set', many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'icon', 'topics', 'participants']

    @staticmethod
    def prefetch_related(queryset):
        queryset = queryset.prefetch_related(
            'topic_set__room_set__roomparticipant_set__participant__user__profile',
            'participant_set__user__profile',
            'participant_set__role'
        )

        return queryset


class GroupCreateSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'icon', 'wall_image', 'category', 'description', 'is_public']
