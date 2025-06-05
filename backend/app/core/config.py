import os
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "SteppersLife 2025"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./steppers_life.db"  # Default to SQLite for easy development
    
    # JWT Security
    SECRET_KEY: str = "dev-secret-key-change-in-production-must-be-32-chars-or-more"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Email Configuration
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "noreply@stepperslife.com"
    SMTP_FROM_NAME: str = "SteppersLife"
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_EXTENSIONS: str = "jpg,jpeg,png,gif,pdf"
    UPLOAD_PATH: str = "./uploads"
    
    # External Services
    STRIPE_PUBLIC_KEY: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    SQUARE_ACCESS_TOKEN: Optional[str] = None
    SQUARE_APPLICATION_ID: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()

# Helper functions
def get_database_url() -> str:
    """Get the configured database URL."""
    return settings.DATABASE_URL

def get_secret_key() -> str:
    """Get the JWT secret key."""
    return settings.SECRET_KEY

def is_development() -> bool:
    """Check if running in development mode."""
    return settings.ENVIRONMENT.lower() == "development"

def is_production() -> bool:
    """Check if running in production mode."""
    return settings.ENVIRONMENT.lower() == "production"

def get_upload_config() -> dict:
    """Get file upload configuration."""
    return {
        "max_size_mb": settings.MAX_FILE_SIZE_MB,
        "allowed_extensions": settings.ALLOWED_FILE_EXTENSIONS.split(","),
        "upload_path": settings.UPLOAD_PATH
    } 