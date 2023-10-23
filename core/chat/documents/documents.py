from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from chat.models import Group, Message


@registry.register_document
class PublicGroupDocument(Document):
    participants = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
    })

    class Index:
        name = 'groups'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }

    class Django:
        model = Group
        fields = [
            'id',
            'name',
            'description',
        ]


@registry.register_document
class MessageDocument(Document):
    sender = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
    })
    room = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    })

    class Index:
        name = 'messages'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }

    class Django:
        model = Message
        fields = [
            'id',
            'text',
        ]
