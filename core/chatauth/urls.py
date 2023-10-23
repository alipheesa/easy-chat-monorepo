from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView
from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view

from django.urls import path, include

from chatauth.views import IsAuthenticatedView, SocialLoginSuccessView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    path('token/refresh/', get_refresh_view().as_view(), name='token-refresh'),
    path('is-authenticated/', IsAuthenticatedView.as_view(), name='is-authenticated'),
    path('accounts/', include('allauth.urls')),
    path('accounts/login/success/', SocialLoginSuccessView().as_view(), name='social-login-success')
]
