"""Views for the Notes API."""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Note
from .serializers import NoteSerializer, UserRegisterSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notes."""
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return notes for the current user."""
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the note with the current user."""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def search(self, request):
        """Search notes by tag or keyword."""
        query = request.query_params.get('q', '')
        tag = request.query_params.get('tag', '')
        
        queryset = self.get_queryset()
        
        if tag:
            queryset = queryset.filter(tags__contains=[tag])
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | 
                Q(content__icontains=query)
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user."""
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login a user and return JWT tokens."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(Q(username=username) | Q(email=username))
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users."""
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
