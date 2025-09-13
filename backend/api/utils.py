import os
import shutil
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid


def copy_file_to_frontend(file, upload_to='posts'):
    """
    Copy uploaded file to frontend public folder and return the relative path
    """
    try:
        # Ensure the frontend directory exists
        if upload_to == 'posts':
            frontend_dir = settings.FRONTEND_MEDIA_ROOT
        elif upload_to == 'profiles':
            frontend_dir = settings.FRONTEND_PROFILE_MEDIA_ROOT
        else:
            frontend_dir = os.path.join(settings.FRONTEND_MEDIA_ROOT, upload_to)
        
        os.makedirs(frontend_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Full path in frontend
        frontend_file_path = os.path.join(frontend_dir, unique_filename)
        
        # Copy file to frontend
        with open(frontend_file_path, 'wb') as dest_file:
            for chunk in file.chunks():
                dest_file.write(chunk)
        
        # Return relative path from frontend public folder
        if upload_to == 'posts':
            return f"/assets/images/posts/{unique_filename}"
        elif upload_to == 'profiles':
            return f"/assets/images/profiles/{unique_filename}"
        else:
            return f"/assets/images/{upload_to}/{unique_filename}"
            
    except Exception as e:
        print(f"Error copying file to frontend: {e}")
        return None


def delete_file_from_frontend(file_path):
    """
    Delete file from frontend public folder
    """
    try:
        if file_path and file_path.startswith('/assets/images/'):
            # Convert relative path to absolute path
            frontend_file_path = os.path.join(
                settings.BASE_DIR.parent, 
                'frontend', 
                'public', 
                file_path.lstrip('/')
            )
            
            if os.path.exists(frontend_file_path):
                os.remove(frontend_file_path)
                return True
    except Exception as e:
        print(f"Error deleting file from frontend: {e}")
    
    return False
