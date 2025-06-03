from fastapi import APIRouter

from app.api.v1.endpoints import admin_categories # Assuming this path is correct
# Import other endpoint routers here as your project grows, for example:
# from app.api.v1.endpoints import events, users, auth

api_router_v1 = APIRouter(prefix="/v1")

# Include the admin categories router
api_router_v1.include_router(
    admin_categories.router, 
    prefix="/admin/event-categories", 
    tags=["Admin - Event Categories"]
)

# Include other routers here:
# api_router_v1.include_router(events.router, prefix="/events", tags=["Events"])
# api_router_v1.include_router(users.router, prefix="/users", tags=["Users"])
# api_router_v1.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# You might have a top-level app instance in main.py that includes this api_router_v1
# e.g., app.include_router(api_router_v1) 