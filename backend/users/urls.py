from django.urls import path
from .views import register_user
from .views import register_user, profile


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

    
urlpatterns = [
    path('signup/', register_user),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('profile/', profile),
]