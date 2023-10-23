from django.urls import path

from chat import views

urlpatterns = [
    path(
        'profile/',
        views.ProfileViewSet.as_view(),
        name='profile-retrieve'
    ),
    path(
        'groups/',
        views.GroupViewSet.as_view({'get': 'list'}),
        name='groups-list'
    ),
    path(
        'groups/create/',
        views.GroupViewSet.as_view({'post': 'create'}),
        name='groups-create'
    ),
    path(
        'groups/<pk>/',
        views.GroupViewSet.as_view({'get': 'retrieve'}),
        name='groups-retrieve'
    ),
    path(
        'groups/<pk>/join/',
        views.GroupJoinView.as_view(),
        name='groups-join'
    ),
    path(
        'groups/<pk>/leave/',
        views.GroupLeaveView.as_view(),
        name='groups-leave'
    ),
    path(
        'groups/<pk>/delete/',
        views.GroupViewSet.as_view({'post': 'destroy'}),
        name='groups-destroy'
    ),
    path(
        'groups/<pk>/update/',
        views.GroupUpdateViewSet.as_view(),
        name='groups-update'
    ),
    path(
        'topics/create/',
        views.TopicViewSet.as_view({'post': 'create'}),
        name='topics-create'
    ),
    path(
        'topics/<pk>/update/',
        views.TopicViewSet.as_view({'post': 'partial_update'}),
        name='topics-update'
    ),
    path(
        'topics/<pk>/delete/',
        views.TopicViewSet.as_view({'post': 'destroy'}),
        name='topics-delete'
    ),
    path(
        'rooms/create/',
        views.RoomViewSet.as_view({'post': 'create'}),
        name='rooms-create'
    ),
    path(
        'rooms/<pk>/',
        views.RoomViewSet.as_view({'get': 'retrieve'}),
        name='rooms-retrieve'
    ),
    path(
        'rooms/<pk>/update/',
        views.RoomViewSet.as_view({'post': 'partial_update'}),
        name='rooms-update'
    ),
    path(
        'rooms/<pk>/delete/',
        views.RoomViewSet.as_view({'post': 'destroy'}),
        name='rooms-delete'
    ),
    path(
        'public-groups/<category>/',
        views.PublicGroupsViewSet.as_view({'get': 'list'}),
        name='public-groups-list'
    ),

    path(
        'public-groups/',
        views.PublicGroupsViewSet.as_view({'get': 'list'}),
        name='public-groups-list'
    ),
]
