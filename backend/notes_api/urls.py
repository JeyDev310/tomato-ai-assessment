"""URL configuration for the Notes API."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, UserViewSet, register, login

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
]
