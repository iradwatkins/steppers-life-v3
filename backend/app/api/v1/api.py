from fastapi import APIRouter

from app.api.v1.endpoints import admin_categories, auth, events, tickets, payments, uploads
# Import other endpoint routers here as your project grows, for example:
# from app.api.v1.endpoints import users

api_router_v1 = APIRouter()

# Include the authentication router
api_router_v1.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["Authentication"]
)

# Include the admin categories router
api_router_v1.include_router(
    admin_categories.router, 
    prefix="/admin/event-categories", 
    tags=["Admin - Event Categories"]
)

# Include the events router
api_router_v1.include_router(
    events.router, 
    prefix="/events", 
    tags=["Events"]
)

# Include the tickets router
api_router_v1.include_router(
    tickets.router, 
    prefix="/tickets", 
    tags=["Tickets"]
)

# Include the payments router
api_router_v1.include_router(
    payments.router, 
    prefix="/payments", 
    tags=["Payments"]
)

# Include the uploads router
api_router_v1.include_router(
    uploads.router, 
    prefix="/uploads", 
    tags=["File Uploads"]
)

# Include other routers here:
# api_router_v1.include_router(events.router, prefix="/events", tags=["Events"])
# api_router_v1.include_router(users.router, prefix="/users", tags=["Users"])

# You might have a top-level app instance in main.py that includes this api_router_v1
# e.g., app.include_router(api_router_v1) 