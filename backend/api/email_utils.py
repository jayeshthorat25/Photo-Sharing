"""
Email utility functions for SnapGram
"""
from django.core.mail import send_mail
from django.conf import settings


def send_welcome_email(user):
    """
    Send a welcome email to newly registered user
    """
    subject = 'Welcome to SnapGram! 🎉'
    
    # HTML email template
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SnapGram</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 28px;
                font-weight: bold;
                color: #877EFF;
                margin-bottom: 10px;
            }}
            .welcome-title {{
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
            }}
            .user-info {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .user-info h3 {{
                margin-top: 0;
                color: #877EFF;
            }}
            .feature-list {{
                list-style: none;
                padding: 0;
            }}
            .feature-list li {{
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }}
            .feature-list li:last-child {{
                border-bottom: none;
            }}
            .cta-button {{
                display: inline-block;
                background-color: #877EFF;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📸 SnapGram</div>
                <h1 class="welcome-title">Welcome to SnapGram!</h1>
            </div>
            
            <p>Hi <strong>{user.name or user.username}</strong>,</p>
            
            <p>We're excited to have you join our community of photo enthusiasts! Your account has been successfully created and you're ready to start sharing your amazing moments.</p>
            
            <div class="user-info">
                <h3>Your Account Details</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name or 'Not provided'}</p>
            </div>
            
            <h3>What you can do on SnapGram:</h3>
            <ul class="feature-list">
                <li>📸 Share your favorite photos and moments</li>
                <li>💬 Connect with friends and discover new people</li>
                <li>❤️ Like and comment on posts</li>
                <li>🔖 Save posts for later viewing</li>
                <li>🔒 Control your privacy with private profiles and posts</li>
                <li>🔍 Search and explore amazing content</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="{settings.FRONTEND_URL}" class="cta-button">Start Sharing Now!</a>
            </div>
            
            <p>If you have any questions or need help getting started, feel free to reach out to our support team. We're here to help!</p>
            
            <div class="footer">
                <p>Happy sharing!</p>
                <p><strong>The SnapGram Team</strong></p>
                <hr>
                <p><em>This is an automated message. Please do not reply to this email.</em></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version
    plain_message = f"""
    Hi {user.name or user.username},
    
    Welcome to SnapGram! We're excited to have you join our community of photo enthusiasts.
    
    Your account has been successfully created with the following details:
    • Username: {user.username}
    • Email: {user.email}
    • Name: {user.name or 'Not provided'}
    
    Here's what you can do on SnapGram:
    📸 Share your favorite photos and moments
    💬 Connect with friends and discover new people
    ❤️ Like and comment on posts
    🔖 Save posts for later
    🔒 Control your privacy with private profiles and posts
    🔍 Search and explore amazing content
    
    Ready to start sharing? Head over to SnapGram and create your first post!
    
    If you have any questions or need help, feel free to reach out to our support team.
    
    Happy sharing!
    The SnapGram Team
    
    ---
    This is an automated message. Please do not reply to this email.
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Welcome email sent successfully to {user.email}")
        return True
    except Exception as e:
        print(f"Welcome email sending failed: {e}")
        return False
