#!/bin/sh

python manage.py makemigrations && python manage.py migrate
python manage.py search_index --rebuild -f

python manage.py collectstatic --noinput


exec "$@"
