from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str = "info"
    is_read: int = 0

class NotificationCreate(NotificationBase):
    client_id: int

class Notification(NotificationBase):
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True
