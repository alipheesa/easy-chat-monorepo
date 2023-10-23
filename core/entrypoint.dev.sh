#!/bin/sh

python manage.py makemigrations && python manage.py migrate
python manage.py search_index --rebuild -f

DJANGO_SUPERUSER_PASSWORD=admin \
DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_EMAIL=admin@admin.com \
	python manage.py createsuperuser --noinput

exec "$@"
