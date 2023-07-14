from django.contrib import admin
from .models import Tag, PostCard, UserProfile

# Register your models here.
admin.site.register(Tag)
admin.site.register(PostCard)
admin.site.register(UserProfile)

