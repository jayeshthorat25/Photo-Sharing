#!/usr/bin/env python
"""
Database setup script for Snapgram backend
Run this script to create the MySQL database and run migrations
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snapgram_backend.settings')

# Setup Django
django.setup()

def setup_database():
    """Setup the database and run migrations"""
    print("Setting up database...")
    
    # Run migrations
    print("Running migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Create superuser (optional)
    print("Database setup complete!")
    print("To create a superuser, run: python manage.py createsuperuser")

if __name__ == '__main__':
    setup_database()
