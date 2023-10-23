import hashlib
import io
import time
import requests

from PIL import Image
from celery import shared_task
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from chat.models import UserProfile


@shared_task
def update_userprofile_icon_on_auth(raw_icon_url, profile_id):
    response = requests.get(raw_icon_url)

    if response.status_code != 200:
        pass

    raw_icon = response.content
    image_hash = hashlib.md5(raw_icon).hexdigest()

    image = Image.open(io.BytesIO(raw_icon))
    w, h = image.size
    w, h = min(w, 100), min(h, 100)
    new_size = (w, h)

    image = image.resize(new_size)

    temp_image = NamedTemporaryFile(delete=True, suffix='.jpg')
    image.save(temp_image.name, 'JPEG', quality=80)

    profile = UserProfile.objects.get(id=profile_id)
    profile.icon.save(f"{image_hash}.jpg", File(temp_image))
    profile.save()
