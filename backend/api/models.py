from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary

"""
SnapGram Database Models

This file defines the core data models for the SnapGram social media application.
The models represent users, posts, and comments with relationships and business logic.
"""

class User(AbstractUser):
    """
    Custom User Model - Core user profile and authentication
    
    Extends Django's AbstractUser to add social media specific fields.
    Features:
    - Profile customization (name, bio, location, avatar)
    - Privacy controls (public/private profiles)
    - Password reset functionality
    - Cloudinary integration for image storage
    """
    # Profile Information
    name = models.CharField(max_length=255, blank=True)                    # Display name
    username = models.CharField(max_length=150, unique=True)              # Unique username
    email = models.EmailField(unique=True)                                # Login email
    bio = models.TextField(blank=True, max_length=500)                    # User bio/description
    location = models.CharField(max_length=255, blank=True)               # User location
    image_path = models.CharField(max_length=500, blank=True, null=True)  # Cloudinary avatar URL
    
    # Privacy and Security
    is_private = models.BooleanField(default=False)                         # Profile privacy setting
    reset_token = models.CharField(max_length=100, blank=True, null=True)  # Password reset token
    reset_token_expires = models.DateTimeField(blank=True, null=True)     # Token expiration
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)                    # Account creation time
    updated_at = models.DateTimeField(auto_now=True)                      # Last profile update

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.username

    @property
    def imageUrl(self):
        return self.image_path

    def save(self, *args, **kwargs):
        # Handle image upload to Cloudinary
        if hasattr(self, '_image_file') and self._image_file:
            # Delete old image from Cloudinary if exists
            if self.image_path:
                delete_from_cloudinary(self.image_path)
            
            # Upload new image to Cloudinary with original filename
            cloudinary_url = upload_to_cloudinary(self._image_file, 'snapgram/profiles')
            if cloudinary_url:
                self.image_path = cloudinary_url
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary when user is deleted
        if self.image_path:
            delete_from_cloudinary(self.image_path)
        super().delete(*args, **kwargs)


class Post(models.Model):
    """
    Post Model - Social media posts and content
    
    Represents individual posts in the social media feed.
    Features:
    - Rich content (text, images, location, tags)
    - Privacy controls (public/private posts)
    - Social interactions (likes, comments)
    - Cloudinary integration for image storage
    - Automatic cleanup on deletion
    """
    # Core Content
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')  # Post author
    caption = models.TextField()                                                    # Post text content
    image_path = models.CharField(max_length=500, blank=True, null=True)            # Cloudinary image URL
    location = models.CharField(max_length=255, blank=True)                         # Post location
    tags = models.CharField(max_length=500, blank=True)                             # Hashtags and tags
    
    # Privacy and Social Features
    is_private = models.BooleanField(default=False)                                 # Post privacy setting
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)   # Users who liked this post
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)                            # Post creation time
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.caption[:50]}"

    @property
    def imageUrl(self):
        return self.image_path

    @property
    def likes_count(self):
        return self.likes.count()

    def save(self, *args, **kwargs):
        # Handle image upload to Cloudinary
        if hasattr(self, '_image_file') and self._image_file:
            # Delete old image from Cloudinary if exists
            if self.image_path:
                delete_from_cloudinary(self.image_path)
            
            # Upload new image to Cloudinary with original filename
            cloudinary_url = upload_to_cloudinary(self._image_file, 'snapgram/posts')
            if cloudinary_url:
                self.image_path = cloudinary_url
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary when post is deleted
        if self.image_path:
            delete_from_cloudinary(self.image_path)
        super().delete(*args, **kwargs)


class Comment(models.Model):
    """Comment model for post comments"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-pinned', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.content[:50]}"


class SavedPost(models.Model):
    """Model for saved posts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'post']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} saved {self.post.id}"
