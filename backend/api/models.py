from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .utils import copy_file_to_frontend, delete_file_from_frontend


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    name = models.CharField(max_length=255, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, max_length=500)
    location = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    image_path = models.CharField(max_length=500, blank=True, null=True)  # Store frontend path
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.username

    @property
    def imageUrl(self):
        if self.image_path:
            return self.image_path
        elif self.image:
            return self.image.url
        return None

    def save(self, *args, **kwargs):
        # Handle image upload and copy to frontend
        if self.image and hasattr(self.image, 'file'):
            # Delete old image from frontend if exists
            if self.image_path:
                delete_file_from_frontend(self.image_path)
            
            # Copy new image to frontend
            frontend_path = copy_file_to_frontend(self.image, 'profiles')
            if frontend_path:
                self.image_path = frontend_path
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete image from frontend when user is deleted
        if self.image_path:
            delete_file_from_frontend(self.image_path)
        super().delete(*args, **kwargs)


class Post(models.Model):
    """Post model for social media posts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    caption = models.TextField()
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    image_path = models.CharField(max_length=500, blank=True, null=True)  # Store frontend path
    location = models.CharField(max_length=255, blank=True)
    tags = models.CharField(max_length=500, blank=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.caption[:50]}"

    @property
    def imageUrl(self):
        if self.image_path:
            return self.image_path
        elif self.image:
            return self.image.url
        return None

    @property
    def likes_count(self):
        return self.likes.count()

    def save(self, *args, **kwargs):
        # Handle image upload and copy to frontend
        if self.image and hasattr(self.image, 'file'):
            # Delete old image from frontend if exists
            if self.image_path:
                delete_file_from_frontend(self.image_path)
            
            # Copy new image to frontend
            frontend_path = copy_file_to_frontend(self.image, 'posts')
            if frontend_path:
                self.image_path = frontend_path
        
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete image from frontend when post is deleted
        if self.image_path:
            delete_file_from_frontend(self.image_path)
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
