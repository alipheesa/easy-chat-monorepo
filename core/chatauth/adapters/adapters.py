import hashlib

import requests
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from dj_rest_auth.jwt_auth import set_jwt_access_cookie
from dj_rest_auth.utils import jwt_encode
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from chat.models import UserProfile
from chatauth.tasks import update_userprofile_icon_on_auth


class SocialAccountAdapter(DefaultSocialAccountAdapter):

    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        data = sociallogin.serialize()['account']

        provider = data['provider']

        user_icon = None
        full_name = user.username

        if provider == 'github':
            user_icon = data['extra_data']['avatar_url']
            full_name = data['extra_data']['name']
        elif provider == 'google':
            user_icon = data['extra_data']['picture']
            full_name = data['extra_data']['name']

        profile = UserProfile.objects.create(user=user, full_name=full_name)

        update_userprofile_icon_on_auth.delay(user_icon, profile.id)

        # response = requests.get(user_icon)
        #
        # profile = UserProfile(user=user, full_name=full_name)
        #
        # if response.status_code == 200:
        #     image = NamedTemporaryFile(delete=True, suffix='.jpg')
        #     image.write(response.content)
        #     image.flush()
        #     image_hash = hashlib.md5(response.content).hexdigest()
        #     profile.icon.save(f"{image_hash}.jpg", File(image))
        #
        # profile.save()

        return user


class AccountAdapter(DefaultAccountAdapter):

    def login(self, request, user):
        request.user = user

    def logout(self, request):
        pass

    def post_login(self, request, user, *args, **kwargs):
        response = super().post_login(request, user, *args, **kwargs)
        access_token, _ = jwt_encode(user)
        set_jwt_access_cookie(response, access_token)
        return response
