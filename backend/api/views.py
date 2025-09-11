from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import User, Post, Comment, SavedPost
from .serializers import (
    UserRegistrationSerializer, UserSerializer, UserUpdateSerializer,
    PostSerializer, PostCreateSerializer, CommentSerializer, SavedPostSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """View for user registration"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """View for user login"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
        
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """View for current user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return UserUpdateSerializer
        return UserSerializer


class UserListView(generics.ListAPIView):
    """View for listing users"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        limit = self.request.query_params.get('limit')
        queryset = User.objects.all()
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        return queryset


class UserDetailView(generics.RetrieveAPIView):
    """View for user detail"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return User.objects.all()


class PostListView(generics.ListCreateAPIView):
    """View for listing and creating posts"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def get_queryset(self):
        offset = int(self.request.query_params.get('offset', 0))
        limit = 20
        return Post.objects.select_related('user').prefetch_related('likes', 'comments')[offset:offset+limit]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecentPostsView(generics.ListAPIView):
    """View for recent posts"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.select_related('user').prefetch_related('likes', 'comments')[:10]


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for post detail, update, and delete"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Post.objects.select_related('user').prefetch_related('likes', 'comments')

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return PostCreateSerializer
        return PostSerializer

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class PostSearchView(generics.ListAPIView):
    """View for searching posts"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        search_term = self.request.query_params.get('q', '')
        if search_term:
            return Post.objects.filter(
                Q(caption__icontains=search_term) |
                Q(tags__icontains=search_term) |
                Q(location__icontains=search_term)
            ).select_related('user').prefetch_related('likes', 'comments')
        return Post.objects.none()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    """View for liking/unliking a post"""
    post = get_object_or_404(Post, id=post_id)
    user = request.user
    
    if post.likes.filter(id=user.id).exists():
        post.likes.remove(user)
        liked = False
    else:
        post.likes.add(user)
        liked = True
    
    return Response({
        'liked': liked,
        'likes_count': post.likes.count()
    })


class UserPostsView(generics.ListAPIView):
    """View for user's posts"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user_id=user_id).select_related('user').prefetch_related('likes', 'comments')


class CommentListView(generics.ListCreateAPIView):
    """View for listing and creating comments"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).select_related('user')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        serializer.save(user=self.request.user, post=post)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for comment detail, update, and delete"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)


class SavedPostListView(generics.ListCreateAPIView):
    """View for listing and creating saved posts"""
    serializer_class = SavedPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedPost.objects.filter(user=self.request.user).select_related('post__user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedPostDetailView(generics.DestroyAPIView):
    """View for deleting saved posts"""
    serializer_class = SavedPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return SavedPost.objects.filter(user=self.request.user)
