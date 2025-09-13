from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', views.UserRegistrationView.as_view(), name='user-registration'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/me/', views.CurrentUserView.as_view(), name='current-user'),
    path('auth/users/', views.UserListView.as_view(), name='user-list'),
    path('auth/users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Post endpoints
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/recent/', views.RecentPostsView.as_view(), name='recent-posts'),
    path('posts/search/', views.PostSearchView.as_view(), name='post-search'),
    path('posts/<int:id>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/public/<int:id>/', views.PublicPostDetailView.as_view(), name='public-post-detail'),
    path('posts/<int:post_id>/like/', views.like_post, name='like-post'),
    path('posts/<int:post_id>/comments/', views.CommentListView.as_view(), name='comment-list'),
    
    # User posts
    path('users/<int:user_id>/posts/', views.UserPostsView.as_view(), name='user-posts'),
    path('users/public/<int:user_id>/posts/', views.PublicUserPostsView.as_view(), name='public-user-posts'),
    
    # Comment endpoints
    path('comments/<int:id>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('comments/<int:comment_id>/pin/', views.CommentPinView.as_view(), name='comment-pin'),
    
    # Saved posts endpoints
    path('saves/', views.SavedPostListView.as_view(), name='saved-post-list'),
    path('saves/<int:id>/', views.SavedPostDetailView.as_view(), name='saved-post-detail'),
]
