from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PostCard, Tag, UserProfile
from django.conf import settings


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('__all__')

class PostCardSerializer(serializers.ModelSerializer):
    tag = serializers.SlugRelatedField(queryset=Tag.objects.all(), slug_field='tag')

    tag_image = serializers.SerializerMethodField()

    class Meta:
        model = PostCard
        fields = ('id', 'title', 'content', 'author', 'date_created', 'tag', 'tag_image', 'is_approved')
    
    def get_tag_image(self, obj):
        if obj.tag.image:
            return settings.MEDIA_URL + str(obj.tag.image)
        return None



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('__all__')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password) #password hash
        user.save()

        return user