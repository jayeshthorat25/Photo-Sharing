import cloudinary.uploader
import cloudinary.api
from django.conf import settings
import os


def upload_to_cloudinary(file, folder="snapgram"):
    """
    Upload a file to Cloudinary and return the public URL
    
    Folder structure:
    - snapgram/profiles/ - User profile images
    - snapgram/posts/ - Post images
    
    Args:
        file: The file to upload
        folder: The folder path (e.g., 'snapgram/profiles' or 'snapgram/posts')
    """
    try:
        # Keep the original filename
        original_filename = file.name
        
        # Create public_id with original filename in the specified folder
        public_id = f"{folder}/{original_filename}"
        
        # Upload file to Cloudinary with original filename
        result = cloudinary.uploader.upload(
            file,
            public_id=public_id,
            resource_type="auto",
            quality="auto",
            fetch_format="auto",
            overwrite=True
        )
        return result['secure_url']
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return None


def delete_from_cloudinary(public_url):
    """
    Delete a file from Cloudinary using its public URL
    """
    try:
        if public_url and 'cloudinary.com' in public_url:
            # Extract public_id from URL
            # URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
            parts = public_url.split('/')
            if len(parts) >= 8:
                # Find the index of 'upload' and get everything after it
                upload_index = parts.index('upload')
                if upload_index + 1 < len(parts):
                    # Skip version number (v1234567890) and get the rest
                    public_id_parts = parts[upload_index + 2:]
                    public_id = '/'.join(public_id_parts)
                    # Remove file extension
                    public_id = public_id.rsplit('.', 1)[0]
                    
                    # Delete from Cloudinary
                    result = cloudinary.uploader.destroy(public_id)
                    return result.get('result') == 'ok'
    except Exception as e:
        print(f"Error deleting from Cloudinary: {e}")
    return False


def get_cloudinary_public_id_from_url(url):
    """
    Extract public_id from Cloudinary URL
    """
    try:
        if url and 'cloudinary.com' in url:
            parts = url.split('/')
            upload_index = parts.index('upload')
            if upload_index + 1 < len(parts):
                public_id_parts = parts[upload_index + 2:]
                public_id = '/'.join(public_id_parts)
                return public_id.rsplit('.', 1)[0]
    except Exception as e:
        print(f"Error extracting public_id: {e}")
    return None
