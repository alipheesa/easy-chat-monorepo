from django.urls import path

from search.views import SearchGroups, SearchMessages

urlpatterns = [
    path('groups/<str:query>/', SearchGroups.as_view()),
    path('messages/<str:query>/', SearchMessages.as_view()),
]
