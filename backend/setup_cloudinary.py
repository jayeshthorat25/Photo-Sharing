#!/usr/bin/env python
"""
Setup script for Cloudinary integration
Run this script to install Cloudinary and set up the environment
"""

import os
import subprocess
import sys

def install_cloudinary():
    """Install Cloudinary package"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "cloudinary==1.41.0"])
        print("✅ Cloudinary package installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing Cloudinary: {e}")
        return False

def check_env_file():
    """Check if .env file exists and has Cloudinary credentials"""
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    
    if not os.path.exists(env_file):
        print("⚠️  .env file not found. Please create one based on env.example")
        return False
    
    with open(env_file, 'r') as f:
        content = f.read()
        
    required_vars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    missing_vars = []
    
    for var in required_vars:
        if f"{var}=" not in content or f"{var}=your-" in content:
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing or incomplete Cloudinary credentials: {', '.join(missing_vars)}")
        print("Please update your .env file with your Cloudinary credentials")
        return False
    
    print("✅ Cloudinary credentials found in .env file")
    return True

def main():
    print("🚀 Setting up Cloudinary integration...")
    print()
    
    # Install Cloudinary
    if not install_cloudinary():
        return
    
    print()
    
    # Check environment file
    if not check_env_file():
        print()
        print("📝 Next steps:")
        print("1. Sign up for a free Cloudinary account at https://cloudinary.com")
        print("2. Get your Cloud Name, API Key, and API Secret from the dashboard")
        print("3. Update your .env file with these credentials")
        print("4. Run the Django server to test the integration")
        return
    
    print()
    print("🎉 Cloudinary setup complete!")
    print("You can now run your Django server and test image uploads.")

if __name__ == "__main__":
    main()
