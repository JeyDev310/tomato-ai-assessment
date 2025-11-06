from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, RegisterView

router = DefaultRouter()
router.register(r'', NoteViewSet, basename='note')

app_name = 'notes'
urlpatterns = [
    path('', include(router.urls)),
]
