#!/usr/bin/env python
"""
Test script for welcome email functionality
Run this script to test the welcome email without creating a full user account
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snapgram_backend.settings')
django.setup()

from api.email_utils import send_welcome_email
from api.models import User

def test_welcome_email():
    """Test the welcome email functionality"""
    print("Testing welcome email functionality...")
    
    # Create a test user (don't save to database)
    test_user = User(
        username='testuser',
        email='test@example.com',
        name='Test User'
    )
    
    print(f"Sending welcome email to: {test_user.email}")
    
    # Test the email function
    success = send_welcome_email(test_user)
    
    if success:
        print("✅ Welcome email sent successfully!")
        print("Check your email inbox (or console if using console backend)")
    else:
        print("❌ Welcome email failed to send")
        print("Check your email configuration in settings.py")

if __name__ == '__main__':
    test_welcome_email()
