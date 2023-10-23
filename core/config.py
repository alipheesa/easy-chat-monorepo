from dotenv import load_dotenv
from os import environ


load_dotenv()


def str_to_bool(value: str) -> bool:
    """Simple function for converting .env string into boolean."""
    if value.lower() in ['true', '1']:
        return True
    elif value.lower() in ['false', '0']:
        return False
    else:
        raise ValueError(f'.env: String representation of boolean (true, false, 1, 0) expected, got "{value}"')


HOST:                           str = environ.get('HOST')
PORT:                           str = environ.get('PORT')
MEDIA_FOLDER_NAME:              str = environ.get('MEDIA_FOLDER_NAME')
STATIC_FOLDER_NAME:             str = environ.get('STATIC_FOLDER_NAME')

SECRET_KEY:                     str = environ.get('SECRET_KEY')

DEBUG:                          bool = str_to_bool(environ.get('DEBUG'))

ADMIN_SITE_ENABLED:             bool = str_to_bool(environ.get('ADMIN_SITE_ENABLED'))
SILK_ENABLED:                   bool = str_to_bool(environ.get('SILK_ENABLED'))

ALLOWED_HOSTS:                  list = environ.get('ALLOWED_HOSTS').split(' ')
CSRF_TRUSTED_ORIGINS:           list = environ.get('CSRF_TRUSTED_ORIGINS').split(' ')

MIN_USERNAME_LENGTH:            int = int(environ.get('MIN_USERNAME_LENGTH'))
MAX_USERNAME_LENGTH:            int = int(environ.get('MAX_USERNAME_LENGTH'))

CORS_ALLOW_ALL_ORIGINS:         bool = str_to_bool(environ.get('CORS_ALLOW_ALL_ORIGINS'))
CORS_ALLOW_CREDENTIALS:         bool = str_to_bool(environ.get('CORS_ALLOW_CREDENTIALS'))

CORS_ALLOWED_ORIGINS:           list = environ.get('CORS_ALLOWED_ORIGINS').split(' ')

TOKEN_SIGNING_KEY:              str = environ.get('TOKEN_SIGNING_KEY')
ROTATE_REFRESH_TOKENS:          bool = str_to_bool(environ.get('ROTATE_REFRESH_TOKENS'))
ACCESS_TOKEN_LIFETIME_DAYS:     int = int(environ.get('ACCESS_TOKEN_LIFETIME_DAYS'))
REFRESH_TOKEN_LIFETIME_DAYS:    int = int(environ.get('REFRESH_TOKEN_LIFETIME_DAYS'))

JWT_AUTH_SECURE:                bool = str_to_bool(environ.get('JWT_AUTH_SECURE'))
JWT_AUTH_HTTPONLY:              bool = str_to_bool(environ.get('JWT_AUTH_HTTPONLY'))
JWT_AUTH_SAMESITE:              str = environ.get('JWT_AUTH_SAMESITE')
JWT_AUTH_ACCESS_COOKIE_NAME:    str = environ.get('JWT_AUTH_ACCESS_COOKIE_NAME')
JWT_AUTH_REFRESH_COOKIE_NAME:   str = environ.get('JWT_AUTH_REFRESH_COOKIE_NAME')

DEFAULT_DB_NAME:                str = environ.get('DEFAULT_DB_NAME')
DEFAULT_DB_USER:                str = environ.get('DEFAULT_DB_USER')
DEFAULT_DB_PASSWORD:            str = environ.get('DEFAULT_DB_PASSWORD')
DEFAULT_DB_HOST:                str = environ.get('DEFAULT_DB_HOST')
DEFAULT_DB_PORT:                str = environ.get('DEFAULT_DB_PORT')

DEFAULT_REDIS_USER:             str = environ.get('DEFAULT_REDIS_USER', '')
DEFAULT_REDIS_PASSWORD:         str = environ.get('DEFAULT_REDIS_PASSWORD')
DEFAULT_REDIS_HOST:             str = environ.get('DEFAULT_REDIS_HOST')
DEFAULT_REDIS_PORT:             str = environ.get('DEFAULT_REDIS_PORT')

DEFAULT_REDIS_URL:              str = (f'redis://{DEFAULT_REDIS_USER}:{DEFAULT_REDIS_PASSWORD}@'
                                       f'{DEFAULT_REDIS_HOST}:{DEFAULT_REDIS_PORT}/0')

ELASTICSEARCH_USER:             str = environ.get('ELASTICSEARCH_USER', '')
ELASTICSEARCH_PASSWORD:         str = environ.get('ELASTICSEARCH_PASSWORD')
ELASTICSEARCH_HOST:             str = environ.get('ELASTICSEARCH_HOST')
ELASTICSEARCH_PORT:             str = environ.get('ELASTICSEARCH_PORT')

ELASTICSEARCH_URL:              str = (f'elasticsearch://{ELASTICSEARCH_USER}:{ELASTICSEARCH_PASSWORD}@'
                                       f'{ELASTICSEARCH_HOST}:{ELASTICSEARCH_PORT}')

DEFAULT_CACHE_BACKEND:          str = environ.get('DEFAULT_CACHE_BACKEND')
DEFAULT_CACHE_TIMEOUT_MINUTES:  int = int(environ.get('DEFAULT_CACHE_TIMEOUT_MINUTES'))

SENTRY_ENABLED:                 bool = str_to_bool(environ.get('SENTRY_ENABLED'))
SENTRY_DSN:                     str = environ.get('SENTRY_DSN', '')

OAUTH_ENABLED_GOOGLE:           bool = str_to_bool(environ.get('OAUTH_ENABLED_GOOGLE'))
OAUTH_ID_GOOGLE:                str = environ.get('OAUTH_ID_GOOGLE', '')
OAUTH_SECRET_GOOGLE:            str = environ.get('OAUTH_SECRET_GOOGLE', '')

OAUTH_ENABLED_GITHUB:           bool = str_to_bool(environ.get('OAUTH_ENABLED_GITHUB'))
OAUTH_ID_GITHUB:                str = environ.get('OAUTH_ID_GITHUB', '')
OAUTH_SECRET_GITHUB:            str = environ.get('OAUTH_SECRET_GITHUB', '')

