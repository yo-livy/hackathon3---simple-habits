from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser


# Create your views here.

class PostCardAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        approved_posts = PostCard.objects.filter(is_approved=True)
        serializer = PostCardSerializer(approved_posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostCardSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostCardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PostCard.objects.all()
    serializer_class = PostCardSerializer

class TagAPIView(APIView):
    def get(self, request):
        posts = Tag.objects.all()
        serializer = TagSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })
    
class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, ]

    def get_object(self):
        return self.request.user.userprofile
    
class PostCardCheckAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        pending_posts = PostCard.objects.filter(is_approved=False)
        serializer = PostCardSerializer(pending_posts, many=True)
        return Response(serializer.data)



    