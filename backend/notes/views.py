from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Note
from .serializers import NoteSerializer, RegisterSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def search_by_tag(self, request):
        tag = request.query_params.get('tag', '')
        if not tag:
            return Response({'error': 'Tag parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        notes = self.get_queryset().filter(tags__icontains=tag)
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search_by_keyword(self, request):
        keyword = request.query_params.get('keyword', '')
        if not keyword:
            return Response({'error': 'Keyword parameter required'}, status=status.HTTP_400_BAD_REQUEST)

        notes = self.get_queryset().filter(
            Q(title__icontains=keyword) | Q(content__icontains=keyword)
        )
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)


class RegisterView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @action(detail=False, methods=['post'])
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
