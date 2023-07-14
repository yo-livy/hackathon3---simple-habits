from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from postmind.views import *



urlpatterns = [
    path('admin/', admin.site.urls),
    path('postcards/', PostCardAPIView.as_view(), name='postcards'),
    path('postcards/<int:pk>/', PostCardDetailView.as_view(), name='postcard-detail'),
    path('tags/', TagAPIView.as_view(), name='tags'),
    path('tags/<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('postcards/check', PostCardCheckAPIView.as_view(), name='postcard-check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)