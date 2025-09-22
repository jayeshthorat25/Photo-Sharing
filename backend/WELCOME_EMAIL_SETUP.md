# Welcome Email Setup Guide

This guide explains how to set up and test the welcome email functionality for SnapGram.

## Overview

When a new user registers on SnapGram, they will automatically receive a welcome email with:
- Account confirmation details
- Platform features overview
- Getting started instructions
- Professional HTML formatting

## Email Configuration

### 1. Environment Variables

Add these variables to your `.env` file:

```env
# Email Settings
EMAIL_BACKEND=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@snapgram.com
FRONTEND_URL=http://localhost:5173
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_HOST_PASSWORD`

### 3. Alternative Email Providers

You can use other SMTP providers by changing the settings:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
```

## Testing

### 1. Console Backend (Development)

For development/testing, you can use the console backend to see emails in the terminal:

```env
EMAIL_BACKEND=console
```

### 2. Test Script

Run the test script to verify email functionality:

```bash
cd backend
python test_welcome_email.py
```

### 3. Manual Testing

1. Start the Django server:
   ```bash
   python manage.py runserver
   ```

2. Register a new user through the frontend or API
3. Check the email inbox (or console output if using console backend)

## Email Template

The welcome email includes:

- **Professional HTML formatting** with SnapGram branding
- **Account details** (username, email, name)
- **Feature overview** with emojis and clear descriptions
- **Call-to-action button** linking to the platform
- **Responsive design** that works on mobile and desktop
- **Plain text fallback** for email clients that don't support HTML

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your email credentials
   - Ensure 2FA is enabled and app password is used
   - Verify SMTP settings

2. **"Connection refused"**
   - Check firewall settings
   - Verify EMAIL_HOST and EMAIL_PORT
   - Try different port (465 for SSL, 587 for TLS)

3. **Emails not received**
   - Check spam/junk folder
   - Verify email address is correct
   - Test with console backend first

### Debug Mode

Enable debug logging in Django settings:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.core.mail': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## Production Considerations

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up proper logging** for email delivery tracking
3. **Implement email templates** with dynamic content
4. **Add unsubscribe functionality** for future marketing emails
5. **Monitor email delivery rates** and bounce handling

## Files Modified

- `api/views.py` - Added welcome email call to registration
- `api/email_utils.py` - New email utility with HTML template
- `test_welcome_email.py` - Test script for email functionality
- `WELCOME_EMAIL_SETUP.md` - This documentation

## Support

If you encounter issues with email setup, check:
1. Django email documentation: https://docs.djangoproject.com/en/stable/topics/email/
2. Your email provider's SMTP documentation
3. Firewall and network settings
