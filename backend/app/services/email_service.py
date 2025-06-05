import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings

class EmailService:
    @staticmethod
    def _send_email(to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> bool:
        """
        Send email using SMTP configuration.
        Returns True if email was sent successfully, False otherwise.
        """
        # If SMTP is not configured, use mock implementation
        if not settings.SMTP_SERVER or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            print(f"[MOCK EMAIL] To: {to_email}")
            print(f"[MOCK EMAIL] Subject: {subject}")
            print(f"[MOCK EMAIL] Body: {body}")
            if html_body:
                print(f"[MOCK EMAIL] HTML Body: {html_body}")
            return True

        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg['To'] = to_email

            # Add text body
            text_part = MIMEText(body, 'plain')
            msg.attach(text_part)

            # Add HTML body if provided
            if html_body:
                html_part = MIMEText(html_body, 'html')
                msg.attach(html_part)

            # Send email
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)

            return True

        except Exception as e:
            print(f"Failed to send email to {to_email}: {str(e)}")
            return False

    @staticmethod
    def send_verification_email(email: str, token: str) -> bool:
        """Send email verification email."""
        verification_url = f"http://localhost:3000/verify-email?token={token}"
        
        subject = "Verify Your SteppersLife Account"
        body = f"""
Welcome to SteppersLife!

Please verify your email address by clicking the link below:
{verification_url}

This verification link will expire in 24 hours.

If you didn't create an account with SteppersLife, please ignore this email.

Best regards,
The SteppersLife Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Welcome to SteppersLife!</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="{verification_url}" 
               style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
               Verify Email Address
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p>{verification_url}</p>
            <p><small>This verification link will expire in 24 hours.</small></p>
            <hr>
            <p><small>If you didn't create an account with SteppersLife, please ignore this email.</small></p>
        </body>
        </html>
        """
        
        return EmailService._send_email(email, subject, body, html_body)

    @staticmethod
    def send_password_reset_email(email: str, token: str) -> bool:
        """Send password reset email."""
        reset_url = f"http://localhost:3000/reset-password?token={token}"
        
        subject = "Reset Your SteppersLife Password"
        body = f"""
We received a request to reset your SteppersLife password.

Click the link below to reset your password:
{reset_url}

This reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
The SteppersLife Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your SteppersLife password.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{reset_url}" 
               style="background-color: #f44336; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
               Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p>{reset_url}</p>
            <p><small>This reset link will expire in 1 hour.</small></p>
            <hr>
            <p><small>If you didn't request a password reset, please ignore this email.</small></p>
        </body>
        </html>
        """
        
        return EmailService._send_email(email, subject, body, html_body)

    @staticmethod
    def send_welcome_email(email: str, first_name: str) -> bool:
        """Send welcome email after email verification."""
        subject = "Welcome to SteppersLife!"
        body = f"""
Hi {first_name}!

Welcome to SteppersLife! Your account has been successfully verified.

You can now:
- Discover amazing fitness events in your area
- Book tickets for classes and workshops
- Connect with fitness instructors and enthusiasts
- Track your wellness journey

Start exploring: http://localhost:3000/events

Best regards,
The SteppersLife Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Welcome to SteppersLife, {first_name}!</h2>
            <p>Your account has been successfully verified and you're ready to start your fitness journey with us!</p>
            
            <h3>What you can do now:</h3>
            <ul>
                <li>🔍 Discover amazing fitness events in your area</li>
                <li>🎫 Book tickets for classes and workshops</li>
                <li>🤝 Connect with fitness instructors and enthusiasts</li>
                <li>📊 Track your wellness journey</li>
            </ul>
            
            <a href="http://localhost:3000/events" 
               style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
               Start Exploring Events
            </a>
            
            <p>Thank you for joining our community!</p>
            <p>Best regards,<br>The SteppersLife Team</p>
        </body>
        </html>
        """
        
        return EmailService._send_email(email, subject, body, html_body) 