from urllib.parse import parse_qs
from typing import Literal

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from dj_rest_auth.jwt_auth import set_jwt_access_cookie
from dj_rest_auth.app_settings import api_settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, Token


User = get_user_model()


@database_sync_to_async
def get_user(scope):

    from django.contrib.auth.models import AnonymousUser

    if "token" not in scope:
        raise ValueError(
            "Cannot find token in scope. You should wrap your consumer in "
            "TokenAuthMiddleware."
        )
    token = scope["token"]
    validated_token = None
    user = None

    try:
        auth = JWTAuthentication()
        validated_token = auth.get_validated_token(token)
    except AuthenticationFailed:
        pass

    if validated_token:
        user = User.objects.get(id=validated_token['user_id'])

    return user or AnonymousUser()


class TokenAuthMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params["token"][0]
        scope["token"] = token
        scope["user"] = await get_user(scope)
        return await self.app(scope, receive, send)


class RefreshAccessTokenMiddleware:
    """
    Middleware responsible for on-the-fly refresh of access token from the incoming request
    and for setting appropriate cookie in response if refresh token is valid.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Get required data.
        access_name = api_settings.JWT_AUTH_COOKIE
        refresh_name = api_settings.JWT_AUTH_REFRESH_COOKIE
        access, refresh = request.COOKIES.get(access_name), request.COOKIES.get(refresh_name)

        if not self.access_valid(access) and self.refresh_valid(refresh):
            # 2. Modify incoming request.
            new_access = self.get_access_token(refresh)
            request.COOKIES[access_name] = str(new_access)

            # 3. Modify outgoing response's cookie.
            response = self.get_response(request)
            set_jwt_access_cookie(response, new_access)
        else:
            # New access token is unneeded or impossible to get - skip middleware.
            response = self.get_response(request)

        return response

    def _is_valid(self, token: "Token", token_type: Literal["access", "refresh"]) -> bool:

        try:
            AccessToken(token) if token_type == "access" else RefreshToken(token)
            return True
        except (InvalidToken, TokenError) as e:
            return False

    def _is_invalid_or_none(self, token: "Token", token_type) -> bool:
        return bool(
            token is None
            or (token
                and not self._is_valid(token, token_type=token_type))
        )

    def access_valid(self, token: "Token") -> bool:
        return not self._is_invalid_or_none(token, token_type="access")

    def refresh_valid(self, token: "Token") -> bool:
        return not self._is_invalid_or_none(token, token_type="refresh")

    def get_access_token(self, refresh_token: "Token") -> "Token":
        return RefreshToken(refresh_token).access_token
