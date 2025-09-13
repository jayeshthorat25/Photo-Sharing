from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Post, Comment, SavedPost


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    imageUrl = serializers.ReadOnlyField()
    posts = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'bio', 'location', 'website', 'imageUrl', 'posts', 'created_at')
        read_only_fields = ('id', 'created_at')

    def get_posts(self, obj):
        # Get user's posts and serialize them with minimal data to avoid circular reference
        posts = obj.posts.all().order_by('-created_at')
        return [
            {
                'id': post.id,
                'caption': post.caption,
                'imageUrl': post.imageUrl,
                'location': post.location,
                'tags': post.tags,
                'likes_count': post.likes_count,
                'comments_count': post.comments.count(),
                'created_at': post.created_at,
            }
            for post in posts
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    imageUrl = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('name', 'bio', 'location', 'website', 'image', 'imageUrl')

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.website = validated_data.get('website', instance.website)
        if 'image' in validated_data:
            instance.image = validated_data['image']
        instance.save()
        return instance


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    user = UserSerializer(read_only=True)
    imageUrl = serializers.ReadOnlyField()
    likes_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user', 'caption', 'imageUrl', 'location', 'tags', 
                 'likes_count', 'is_liked', 'comments_count', 'is_edited', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_edited(self, obj):
        """Check if post has been edited"""
        time_diff = obj.updated_at - obj.created_at
        return time_diff.total_seconds() > 1  # More than 1 second difference


class PostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating posts"""
    class Meta:
        model = Post
        fields = ('caption', 'image', 'location', 'tags')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for comments"""
    user = UserSerializer(read_only=True)
    is_edited = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'pinned', 'created_at', 'updated_at', 'is_edited')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_is_edited(self, obj):
        """Check if comment has been edited"""
        # Only mark as edited if updated_at is significantly different from created_at
        # This prevents new comments from being marked as edited due to microsecond differences
        time_diff = obj.updated_at - obj.created_at
        return time_diff.total_seconds() > 1  # More than 1 second difference

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SavedPostSerializer(serializers.ModelSerializer):
    """Serializer for saved posts"""
    post = PostSerializer(read_only=True)

    class Meta:
        model = SavedPost
        fields = ('id', 'post', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SavedPostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating saved posts"""
    
    class Meta:
        model = SavedPost
        fields = ('post',)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)