import abc

from django.http import HttpResponse
from elasticsearch_dsl import Q
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.documents.documents import MessageDocument, PublicGroupDocument
from chat.models import Group, Message
from chat.serializers import MessageSearchSerializer, PublicGroupSerializer


class ElasticSearchAPIView(APIView):
    serializer_class = None
    document_class = None

    @abc.abstractmethod
    def generate_q_expression(self, query):
        """This method should be overridden
        and return a Q() expression."""

    @abc.abstractmethod
    def get_queryset(self, request, ids):
        """This method should be overridden
        and return a queryset."""

    def get(self, request, query):
        try:
            q = self.generate_q_expression(query)
            search = self.document_class.search().query(q)
            response = search.execute()

            ids = [hit.id for hit in response]
            queryset = self.get_queryset(request, ids)

            serializer = self.serializer_class(queryset, context={'request': request}, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return HttpResponse(e, status=500)


class SearchGroups(ElasticSearchAPIView):
    serializer_class = PublicGroupSerializer
    document_class = PublicGroupDocument

    def generate_q_expression(self, query):
        return Q(
            'bool',
            should=[
                Q('match', name=query),
                Q('match', description=query),
            ],
            minimum_should_match=1
        )

    def get_queryset(self, request, ids):
        queryset = Group.objects.filter(is_public=True, id__in=ids)
        queryset = PublicGroupSerializer.prefetch_related(queryset)
        return queryset


class SearchMessages(ElasticSearchAPIView):
    serializer_class = MessageSearchSerializer
    document_class = MessageDocument

    def generate_q_expression(self, query):
        return Q(
            'bool',
            should=[
                Q('match', text={'query': query, 'fuzziness': 'auto'}),
                Q('match', sender__username={'query': query, 'fuzziness': 'auto'}),
            ],
            minimum_should_match=1
        )

    def get_queryset(self, request, ids):
        user = request.user
        queryset = Message.objects.filter(id__in=ids, room__topic__group__participants=user)
        return queryset
