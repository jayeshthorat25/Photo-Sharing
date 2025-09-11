# Snapgram Backend (Django + MySQL)

This is the Django REST API backend for the Snapgram social media application.

## Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE snapgram_db;
```

2. Update database settings in `snapgram_backend/settings.py`

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
```

### 5. Run Server

```bash
python manage.py runserver
```

Server will be available at `http://127.0.0.1:8000`

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user
- `PATCH /api/auth/me/` - Update current user

### Posts
- `GET /api/posts/` - List posts
- `POST /api/posts/` - Create post
- `GET /api/posts/{id}/` - Get post
- `PATCH /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/{id}/like/` - Like/unlike post

### Comments
- `GET /api/posts/{id}/comments/` - Get comments
- `POST /api/posts/{id}/comments/` - Create comment
- `PATCH /api/comments/{id}/` - Update comment
- `DELETE /api/comments/{id}/` - Delete comment

### Saved Posts
- `GET /api/saves/` - Get saved posts
- `POST /api/saves/` - Save post
- `DELETE /api/saves/{id}/` - Unsave post

## Models

- **User**: Custom user model with profile fields
- **Post**: Social media posts with images and metadata
- **Comment**: Comments on posts
- **SavedPost**: User's saved posts

## Features

- JWT Authentication
- Image upload support
- Like/unlike functionality
- Comment system
- Save posts
- Search functionality
- Pagination
- CORS support

## Development

### Running Tests
```bash
python manage.py test
```

### Database Shell
```bash
python manage.py shell
```

### Admin Interface
Visit `http://127.0.0.1:8000/admin/` after creating superuser

## Configuration

Key settings in `snapgram_backend/settings.py`:

- Database configuration
- JWT settings
- CORS settings
- Media file settings
- Authentication settings

## Dependencies

- Django 5.2.6
- Django REST Framework 3.16.1
- Django CORS Headers 4.8.0
- MySQL Client 2.2.7
- Pillow 11.3.0
- Simple JWT 5.3.0
