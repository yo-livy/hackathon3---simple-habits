from django.dispatch import receiver
from .models import *
from django.db.models.signals import post_save, post_delete



@receiver(post_save, sender=PostCard)
def update_tag_usage_count_on_post_save(sender, instance, created, **kwargs):
    if created:
        instance.tag.update_usage_count()

@receiver(post_delete, sender=PostCard)
def update_tag_usage_count_on_post_delete(sender, instance, **kwargs):
    instance.tag.update_usage_count()

