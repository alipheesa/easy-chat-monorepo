from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer
from rest_framework import serializers
from allauth.account import app_settings as allauth_account_settings

from chat.models import UserProfile


class RegisterSerializer(DefaultRegisterSerializer):
    full_name = serializers.CharField(max_length=45)
    email = serializers.EmailField(required=allauth_account_settings.EMAIL_REQUIRED, allow_blank=True)

    def validate_full_name(self, full_name):
        return full_name

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'full_name': self.validated_data.get('full_name', ''),
        }

    def instantiate_user_profile(self, user):
        full_name = self.get_cleaned_data().get('full_name')
        UserProfile.objects.create(user=user, full_name=full_name)

    def save(self, request):
        user = super().save(request)
        self.instantiate_user_profile(user)
        return user
