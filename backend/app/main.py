from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.db.session import engine
from app.models.models import Base

# Create uploads directory if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Apart24 API",
    description="Backend for Apart24 Admin and Telegram Mini App",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api/v1/uploads", StaticFiles(directory="uploads"), name="uploads")

from app.api.v1 import apartments, complexes, bookings, dashboard, upload, bot, notifications

app.include_router(apartments.router, prefix="/api/v1/apartments", tags=["apartments"])
app.include_router(complexes.router, prefix="/api/v1/complexes", tags=["complexes"])
app.include_router(bookings.router, prefix="/api/v1", tags=["bookings/clients"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(bot.router, prefix="/api/v1/bot", tags=["bot"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Apart24 API", "status": "online"}
