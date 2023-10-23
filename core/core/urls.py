from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from config import ADMIN_SITE_ENABLED, SILK_ENABLED

urlpatterns = [
    path('auth/', include('chatauth.urls')),
    path('api/', include('chat.urls')),
    path('search/', include('search.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if SILK_ENABLED:
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]

if ADMIN_SITE_ENABLED:
    urlpatterns += [path('admin/', admin.site.urls)]
