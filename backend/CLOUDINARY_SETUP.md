# Cloudinary Integration Setup

This guide will help you set up Cloudinary for image storage in your Photo-Sharing application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides:
- Automatic image optimization and transformation
- Global CDN for fast image delivery
- Automatic format conversion (WebP, AVIF, etc.)
- Image resizing and cropping
- Secure cloud storage

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Update Environment Variables

1. Copy `env.example` to `.env` if you haven't already:
   ```bash
   cp env.example .env
   ```

2. Update your `.env` file with your Cloudinary credentials:
   ```env
   # Cloudinary Settings
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=your-actual-api-key
   CLOUDINARY_API_SECRET=your-actual-api-secret
   ```

### 4. Install Dependencies

Run the setup script:
```bash
python setup_cloudinary.py
```

Or install manually:
```bash
pip install cloudinary==1.41.0
```

### 5. Test the Integration

1. Start your Django server:
   ```bash
   python manage.py runserver
   ```

2. Start your frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Try uploading an image through the app

## How It Works

### Backend Changes

1. **Models**: Updated `User` and `Post` models to use Cloudinary for image storage
2. **Utils**: Created `cloudinary_utils.py` with helper functions for upload/delete operations
3. **Settings**: Added Cloudinary configuration to Django settings
4. **Serializers**: No changes needed - existing file upload handling works with Cloudinary

### Frontend Changes

- **No changes needed!** The existing `getImageUrl()` function already handles both local and remote URLs
- Cloudinary URLs (starting with `https://`) are returned as-is
- Local URLs are still handled for backward compatibility

### Image Storage Structure

Images are stored in Cloudinary with a well-organized folder structure:

```
snapgram/
├── profiles/
│   ├── profile_picture.jpg
│   ├── avatar.png
│   ├── my_photo.jpg
│   └── ...
└── posts/
    ├── vacation_photo.jpg
    ├── sunset.png
    ├── party_pic.jpg
    └── ...
```

**Folder Organization:**
- **Profile images**: `snapgram/profiles/` - User profile pictures and avatars
- **Post images**: `snapgram/posts/` - All post images and media

### Filename Format

Images keep their original filenames for easy identification:
- **Format**: `{original_filename}`
- **Example**: `my_photo.jpg`, `vacation_pic.png`, `profile_avatar.jpg`

**Benefits:**
- Original filename preserved exactly as uploaded
- Easy to identify files by their original names
- Organized by content type (profiles vs posts)
- Simple and clean file structure

## Benefits

1. **Scalability**: No local storage limitations
2. **Performance**: Global CDN for fast image delivery
3. **Optimization**: Automatic image compression and format conversion
4. **Reliability**: 99.9% uptime SLA
5. **Security**: Secure cloud storage with access controls

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month
- 1,000 API requests per month

This is more than sufficient for development and small to medium applications.

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**
   - Double-check your Cloudinary credentials in `.env`
   - Ensure there are no extra spaces or quotes

2. **Images not uploading**
   - Check your internet connection
   - Verify Cloudinary account is active
   - Check Django server logs for error messages

3. **Images not displaying**
   - Check browser console for CORS errors
   - Verify image URLs are being generated correctly

### Debug Mode

To see detailed Cloudinary logs, add this to your Django settings:
```python
import logging
logging.getLogger('cloudinary').setLevel(logging.DEBUG)
```

## Migration from Local Storage

If you have existing images stored locally:

1. **Backup your data** before making changes
2. The new system will automatically use Cloudinary for new uploads
3. Existing local images will continue to work until replaced
4. Consider creating a migration script to upload existing images to Cloudinary

## Security Notes

- Never commit your `.env` file to version control
- Keep your API secret secure
- Consider using environment-specific Cloudinary accounts for production
- Enable Cloudinary's security features like signed URLs if needed

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Django Cloudinary Integration](https://cloudinary.com/documentation/django_integration)
- [Cloudinary Support](https://support.cloudinary.com/)
