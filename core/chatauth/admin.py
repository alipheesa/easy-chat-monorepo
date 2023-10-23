from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Permission
from django.utils.translation import gettext_lazy as _

from chat.models import UserProfile
from chatauth.models import User


class CustomUserCreationForm(UserCreationForm):
    full_name = forms.CharField(max_length=45, required=True)

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'full_name']


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    add_form = CustomUserCreationForm
    exclude = ('first_name', 'last_name')
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("email",)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2", "full_name"),
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        full_name = form.cleaned_data.get('full_name')
        if full_name:
            UserProfile.objects.create(user=obj, full_name=full_name)


admin.site.register(Permission)
