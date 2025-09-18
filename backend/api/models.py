from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    name = models.CharField(max_length=255, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, max_length=500)
    location = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    image_path = models.CharField(max_length=500, blank=True, null=True)  # Store Cloudinary URL
    is_private = models.BooleanField(default=False)  # Privacy setting for profile
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    reset_token_expires = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

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
    """Post model for social media posts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    caption = models.TextField()
    image_path = models.CharField(max_length=500, blank=True, null=True)  # Store Cloudinary URL
    location = models.CharField(max_length=255, blank=True)
    tags = models.CharField(max_length=500, blank=True)
    is_private = models.BooleanField(default=False)  # Privacy setting for individual posts
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
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
