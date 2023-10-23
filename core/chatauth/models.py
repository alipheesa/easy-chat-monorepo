from guardian.mixins import GuardianUserMixin
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from chatauth.validators.validators import SlugUsernameValidator


class User(GuardianUserMixin, AbstractUser):
    """
    A custom User model.

    * First and last name fields are removed.
    * Username is now represented by slug characters only, max_length reduced from 150 to 45,
      min_length=5 added.

    Username and password are required. Email field is optional.
    """

    username_validator = SlugUsernameValidator()

    username = models.CharField(
        _("username"),
        max_length=45,
        unique=True,
        help_text=_(
            "Required. Must contain from 5 to 45 characters."
            "Not shorter than 5 characters. Letters, digits and -/_ only."
        ),
        validators=[username_validator, MinLengthValidator(5)],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )

    first_name = None
    last_name = None
