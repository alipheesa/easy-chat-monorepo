from django.contrib.auth.models import Group as PermissionGroup
from django.core.cache import cache
from guardian.shortcuts import assign_perm
from rest_framework import mixins, status, views, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chat import models, serializers
from chat.permissions.permissions import UserCanChangeGroup, UserCanDeleteGroup, UserIsGroupMember


class ProfileViewSet(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(models.User, id=request.user.id)
        serializer = serializers.UserSerializer(user, context={'request': request})
        data = serializer.data

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = get_object_or_404(models.User, id=request.user.id)
        profile = models.UserProfile.objects.get(user=user.pk)
        user_data = {k: v for k, v in request.data.items() if k in ['username']}
        profile_data = {k: v for k, v in request.data.items() if k not in ['username']}

        if user_data:
            serializer = serializers.UserSerializer(user, data=user_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()

        if profile_data:
            serializer = serializers.UserProfileUpdateSerializer(profile, data=profile_data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()

        return Response(status=status.HTTP_200_OK)


class GroupUpdateViewSet(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        group_id = kwargs.get('pk')

        group = get_object_or_404(models.Group, id=group_id, participant__user=request.user.id)
        serializer = serializers.GroupUpdateSerializer(group, context={'request': request})
        data = serializer.data

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        group_id = kwargs.get('pk')

        group = get_object_or_404(models.Group, id=group_id, participant__user=request.user.id)
        serializer = serializers.GroupUpdateSerializer(group, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ModelViewSet):

    def get_queryset(self, **kwargs):
        if self.action in ['update', 'partial_update', 'destroy']:
            pk = kwargs.get('pk')
            queryset = models.Group.objects.filter(id=pk, participant__user=self.request.user).first()

            return queryset

        elif self.action == 'retrieve':
            pk = kwargs.get('pk')
            queryset = get_object_or_404(models.Group, id=pk, participant__user=self.request.user)
            queryset = serializers.GroupDetailSerializer.prefetch_related(queryset)

            return queryset

        elif self.action == 'list':
            user = self.request.user
            queryset = models.Group.objects.filter(participant__user=user)
            queryset = serializers.GroupSerializer.prefetch_related(queryset, user)

            return queryset

    def get_permissions(self):
        if self.action == 'partial_update':
            return IsAuthenticated(), UserIsGroupMember(), UserCanChangeGroup()
        if self.action == 'destroy':
            return IsAuthenticated(), UserIsGroupMember(), UserCanDeleteGroup()
        else:
            return IsAuthenticated(),

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return serializers.GroupCreateSerializer
        elif self.action == 'retrieve':
            return serializers.GroupDetailSerializer
        elif self.action == 'list':
            return serializers.GroupSerializer

    def get_object(self):
        group = get_object_or_404(models.Group, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, group)
        return group

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group = serializer.save()
        user = request.user
        models.Participant.objects.create(user=user, group=group)

        admin, _ = self.create_permission_groups(group)
        user.groups.add(admin)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def create_permission_groups(self, group):
        admin = PermissionGroup.objects.create(name=f'Admin-{group.id}')
        assign_perm('delete_group', admin, group)
        assign_perm('change_group', admin, group)
        assign_perm('invite_in_group', admin, group)
        assign_perm('assign_roles_in_group', admin, group)

        moderator = PermissionGroup.objects.create(name=f'Moderator-{group.id}')
        assign_perm('change_group', moderator, group)
        assign_perm('invite_in_group', moderator, group)

        return admin, moderator

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        admin = PermissionGroup.objects.get(name=f'Admin-{instance.pk}')
        moderator = PermissionGroup.objects.get(name=f'Moderator-{instance.pk}')
        self.perform_destroy(instance)
        self.perform_destroy(admin)
        self.perform_destroy(moderator)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PublicGroupsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.PublicGroupSerializer

    def get_queryset(self, **kwargs):
        category = kwargs.get('category')

        if category is not None:
            queryset = models.Group.objects.filter(category=category, is_public=True)
        else:
            queryset = models.Group.objects.filter(is_public=True)

        queryset = serializers.PublicGroupSerializer.prefetch_related(queryset)

        return queryset

    def list(self, request, *args, **kwargs):
        category = kwargs.get('category', None)

        data = cache.get(f'public_groups_{category}' if category else 'public_groups')

        if data is None:
            queryset = self.get_queryset(category=category)
            data = self.get_serializer_class()(queryset, context=self.get_serializer_context(), many=True).data
            cache.set(f'public_groups_{category}', data)

        return Response(data)


class GroupJoinView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        pk = kwargs.get('pk')

        group = get_object_or_404(models.Group, id=pk)

        if group.is_public:
            models.Participant.objects.get_or_create(user=user, group=group)
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_403_FORBIDDEN)


class GroupLeaveView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        pk = kwargs.get('pk')

        group = get_object_or_404(models.Group, id=pk)
        participant = get_object_or_404(models.Participant, user=user, group=group)

        participant.delete()

        return Response(status=status.HTTP_200_OK)


class RoomViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = models.Room.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.RoomSerializer
        elif self.action in ['create', 'update', 'destroy']:
            return serializers.RoomSerializerBase

    def get_serializer_context(self):
        return super().get_serializer_context()

    def retrieve(self, request, *args, **kwargs):
        room_id = kwargs.get('pk', None)

        queryset = get_object_or_404(models.Room, id=room_id, participants__user_id=request.user.id)
        serializer = self.get_serializer_class()
        data = serializer(queryset, context=self.get_serializer_context()).data

        return Response(data)


class TopicViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):

    def get_serializer_class(self):
        return serializers.TopicCreateSerializer

    def get_queryset(self):
        return models.Topic.objects.all()
