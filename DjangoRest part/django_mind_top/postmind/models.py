from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Tag(models.Model):
    tag = models.CharField(max_length=50)
    usage_count = models.IntegerField(default=0)
    image = models.ImageField(upload_to='tag_images/')

    def __str__(self):
        return self.tag
    
    def update_usage_count(self):
        self.usage_count = self.postcards.count()
        self.save(update_fields=['usage_count'])


class PostCard(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField(max_length=300)
    # author = models.ForeignKey(User, on_delete=models.CASCADE)
    author = models.CharField(max_length=50)
    date_created = models.DateTimeField(auto_now_add=True)
    tag = models.ForeignKey(Tag, related_name='postcards', on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

