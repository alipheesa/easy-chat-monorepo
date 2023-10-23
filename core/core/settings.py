from datetime import timedelta
from pathlib import Path

from django.urls import reverse_lazy

import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config.SECRET_KEY

DEBUG = config.DEBUG

ALLOWED_HOSTS = config.ALLOWED_HOSTS

CSRF_TRUSTED_ORIGINS = config.CSRF_TRUSTED_ORIGINS

AUTH_USER_MODEL = 'chatauth.User'

SITE_ID = 1

# WSGI Application (default).
WSGI_APPLICATION = 'core.wsgi.application'

# ASGI Application (if Daphne/Uvicorn is used).
ASGI_APPLICATION = 'core.asgi.application'


# ------- CUSTOM PROJECT ESSENTIALS -------


# Disabled
# MIN_USERNAME_LENGTH = env.MIN_USERNAME_LENGTH
# MAX_USERNAME_LENGTH = env.MAX_USERNAME_LENGTH
# # NOTE: Make migrations && migrate when changing username length settings.


# -------- THIRD PARTY ESSENTIALS  --------


# CORS Headers.
CORS_ALLOW_ALL_ORIGINS = config.CORS_ALLOW_ALL_ORIGINS
CORS_ALLOW_CREDENTIALS = config.CORS_ALLOW_CREDENTIALS
CORS_ALLOWED_ORIGINS = config.CORS_ALLOWED_ORIGINS


# Django session-based Auth (for admin panel).
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'guardian.backends.ObjectPermissionBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# DRF token-based Auth (for application API).
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    )
}


# JWT Token settings.
SIMPLE_JWT = {
    'SIGNING_KEY': config.TOKEN_SIGNING_KEY,
    'ACCESS_TOKEN_LIFETIME': timedelta(days=config.ACCESS_TOKEN_LIFETIME_DAYS),
    'REFRESH_TOKEN_LIFETIME ': timedelta(days=config.REFRESH_TOKEN_LIFETIME_DAYS),
    'ROTATE_REFRESH_TOKENS': config.ROTATE_REFRESH_TOKENS,
}


# Django REST Auth settings.
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_SECURE': config.JWT_AUTH_SECURE,
    'JWT_AUTH_HTTPONLY': config.JWT_AUTH_HTTPONLY,
    'JWT_AUTH_SAMESITE': config.JWT_AUTH_SAMESITE,
    'JWT_AUTH_COOKIE': config.JWT_AUTH_ACCESS_COOKIE_NAME,
    'JWT_AUTH_REFRESH_COOKIE': config.JWT_AUTH_REFRESH_COOKIE_NAME,
    'REGISTER_SERIALIZER': 'chatauth.serializers.RegisterSerializer',
    'EMAIL_REQUIRED': False,
    'OLD_PASSWORD_FIELD_ENABLED': True,
}
# NOTE: Change 'JWT_AUTH_SECURE' to True if https enabled.


# Performance Monitoring settings (Silk).
SILKY_AUTHENTICATION = True
SILKY_AUTHORISATION = True
SILKY_META = True


# Performance Monitoring settings (Sentry).
# import sentry_sdk
# from sentry_sdk.integrations.django import DjangoIntegration
if config.SENTRY_ENABLED:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=config.SENTRY_DSN,
        integrations=[DjangoIntegration()],
        send_default_pii=True,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment='dev'
    )


# Advanced Protocol Handling settings (Django Channels).
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [config.DEFAULT_REDIS_URL],
        },
    },
}


# Social Authentication (OAuth via Allauth).
ACCOUNT_ADAPTER = 'chatauth.adapters.AccountAdapter'
SOCIALACCOUNT_ADAPTER = 'chatauth.adapters.SocialAccountAdapter'
SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_PROVIDERS = dict()
if config.OAUTH_ENABLED_GOOGLE:
    SOCIALACCOUNT_PROVIDERS['google'] = {
        'APP': {
            'client_id': config.OAUTH_ID_GOOGLE,
            'secret': config.OAUTH_SECRET_GOOGLE,
        },
        'SCOPE': [
            'profile',
            'email',
        ],
    }
if config.OAUTH_ENABLED_GITHUB:
    SOCIALACCOUNT_PROVIDERS['github'] = {
        'APP': {
            'client_id': config.OAUTH_ID_GITHUB,
            'secret': config.OAUTH_SECRET_GITHUB,
        }
    }


# Advanced Search Mechanism (Elasticsearch).
ELASTICSEARCH_DSL = {
    'default': {
        'hosts': config.ELASTICSEARCH_URL
    },
}


# Task Queue (Celery).
CELERY_BROKER_URL = config.DEFAULT_REDIS_URL
CELERY_RESULT_BACKEND = config.DEFAULT_REDIS_URL


# Attribute / Permission -based Access Control System (Guardian).
GUARDIAN_MONKEY_PATCH = False


# ----------- DJANGO ESSENTIALS -----------


# Installed apps.
THIRD_PARTY_APPS_BEFORE = [
    'daphne',
    'corsheaders',
]
DJANGO_DEFAULT_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
]
THIRD_PARTY_APPS_AFTER = [
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'channels',
    'guardian',
    'silk',
    'django_elasticsearch_dsl',
]
PROJECT_APPS = [
    'chatauth.apps.ChatauthConfig',
    'search.apps.SearchConfig',
    'chat.apps.ChatConfig',
]
INSTALLED_APPS = THIRD_PARTY_APPS_BEFORE \
                 + DJANGO_DEFAULT_APPS \
                 + THIRD_PARTY_APPS_AFTER \
                 + PROJECT_APPS


# Middleware.
THIRD_PARTY_MIDDLEWARE_BEFORE = [
    'corsheaders.middleware.CorsMiddleware',
    'chatauth.middleware.RefreshAccessTokenMiddleware',
]
DJANGO_DEFAULT_MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
THIRD_PARTY_MIDDLEWARE_AFTER = [
    'silk.middleware.SilkyMiddleware',
]
MIDDLEWARE = THIRD_PARTY_MIDDLEWARE_BEFORE \
             + DJANGO_DEFAULT_MIDDLEWARE \
             + THIRD_PARTY_MIDDLEWARE_AFTER


# Database.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config.DEFAULT_DB_NAME,
        'USER': config.DEFAULT_DB_USER,
        'PASSWORD': config.DEFAULT_DB_PASSWORD,
        'HOST': config.DEFAULT_DB_HOST,
        'PORT': config.DEFAULT_DB_PORT,
    }
}


# Cache.
CACHES = {
    "default": {
        "BACKEND": config.DEFAULT_CACHE_BACKEND,
        "LOCATION": config.DEFAULT_REDIS_URL,
        "TIMEOUT": config.DEFAULT_CACHE_TIMEOUT_MINUTES * 60,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        }
    }
}


# Misc.
ROOT_URLCONF = 'core.urls'
MEDIA_URL = f'{config.MEDIA_FOLDER_NAME}/'
STATIC_URL = f'{config.STATIC_FOLDER_NAME}/'
MEDIA_ROOT = BASE_DIR / config.MEDIA_FOLDER_NAME
STATIC_ROOT = BASE_DIR / config.STATIC_FOLDER_NAME
LOGIN_REDIRECT_URL = reverse_lazy('social-login-success')

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

