"""App configuration for Notes API."""
from django.apps import AppConfig


class NotesApiConfig(AppConfig):
    """Config for Notes API app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notes_api'
