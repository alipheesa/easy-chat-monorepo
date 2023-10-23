from channels.routing import URLRouter
from django.urls import path

from chat.consumers.consumers import GroupConsumer, NotificationConsumer
from chatauth.middleware.middleware import TokenAuthMiddleware

websocket_urlpatters = TokenAuthMiddleware(
    URLRouter([
        path('ws/chat', GroupConsumer.as_asgi()),
        path('ws/notifications', NotificationConsumer.as_asgi()),
    ])
)
