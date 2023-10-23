from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from dj_rest_auth.jwt_auth import JWTCookieAuthentication

from config import HOST, PORT


class IsAuthenticatedView(APIView):

    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_200_OK)


class SocialLoginSuccessView(APIView):

    def get(self, request):
        response = render(request, 'social_login_success.html', context={
            'ORIGIN_HOST': f'http://{HOST}:{PORT}'
        })
        response.set_cookie('oauth_status', '1', max_age=10)
        return response

