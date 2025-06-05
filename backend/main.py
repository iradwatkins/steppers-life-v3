from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1.api import api_router_v1
from app.core.config import settings
from app.core.database import init_db, check_db_health, get_db_connection_info

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI.
    Handles startup and shutdown events.
    """
    # Startup
    print("🚀 Starting SteppersLife API...")
    print(f"📊 Database Info: {get_db_connection_info()}")
    
    try:
        init_db()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise e
    
    # Check database health
    if check_db_health():
        print("💚 Database health check passed!")
    else:
        print("💔 Database health check failed!")
    
    print(f"🌍 Environment: {settings.ENVIRONMENT}")
    print(f"🔑 JWT Algorithm: {settings.ALGORITHM}")
    print(f"📧 Email Service: {'Configured' if settings.SMTP_SERVER else 'Mock Mode'}")
    print("🎉 SteppersLife API is ready!")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down SteppersLife API...")
    print("👋 Goodbye!")

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="SteppersLife 2025 - Fitness Events Platform API",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router_v1, prefix=settings.API_V1_PREFIX)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to SteppersLife 2025 API!",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "docs_url": f"{settings.API_V1_PREFIX}/docs",
        "api_prefix": settings.API_V1_PREFIX
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    db_healthy = check_db_health()
    
    if not db_healthy:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
        "version": "2.0.0"
    }

# Database info endpoint (for development)
@app.get("/info")
async def info():
    """Development endpoint to check configuration."""
    if not settings.DEBUG:
        raise HTTPException(status_code=404, detail="Not found")
    
    return {
        "database": get_db_connection_info(),
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "email_configured": bool(settings.SMTP_SERVER),
        "api_prefix": settings.API_V1_PREFIX
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    ) 