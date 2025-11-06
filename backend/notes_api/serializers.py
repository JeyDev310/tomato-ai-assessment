"""Serializers for the Notes API."""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class NoteSerializer(serializers.ModelSerializer):
    """Serializer for Note model."""
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'tags', 'created_at', 'updated_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
