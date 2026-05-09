from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.apartment import Apartment
from app.schemas.complex import Complex

class ClientBase(BaseModel):
    tg_id: str
    name: str
    phone: Optional[str] = None
    photo_url: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    apartment_id: Optional[int] = None
    client_id: int
    check_in: datetime
    check_out: datetime
    total_price: float
    status: str = "pending"
    payment_method: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[str] = None

class Booking(BookingBase):
    id: int
    created_at: datetime
    apartment: Optional[Apartment] = None
    client: Optional[Client] = None

    class Config:
        from_attributes = True
