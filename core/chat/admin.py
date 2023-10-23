from django.contrib import admin
from chat import models


admin.site.register(models.UserProfile)
admin.site.register(models.Group)
admin.site.register(models.Topic)
admin.site.register(models.Room)
admin.site.register(models.Message)
admin.site.register(models.Participant)
admin.site.register(models.RoomParticipant)
admin.site.register(models.GroupRole)
