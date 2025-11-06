"""Admin configuration for the Notes API."""
from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    """Admin interface for Note model."""
    list_display = ['title', 'user', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['title', 'content']
