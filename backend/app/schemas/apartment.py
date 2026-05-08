from pydantic import BaseModel
from typing import Optional, List

class ApartmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    address: str
    price: float
    guests: int
    bedrooms: Optional[int] = 1
    bathrooms: Optional[int] = 1
    size: str
    lat: Optional[str] = None
    lng: Optional[str] = None
    status: str = "free"
    image: Optional[str] = None
    images: Optional[str] = None
    amenities: Optional[str] = None
    complex_id: Optional[int] = None

class ApartmentCreate(ApartmentBase):
    pass

class ApartmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    price: Optional[float] = None
    guests: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    size: Optional[str] = None
    lat: Optional[str] = None
    lng: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    images: Optional[str] = None
    amenities: Optional[str] = None
    complex_id: Optional[int] = None

class Apartment(ApartmentBase):
    id: int

    class Config:
        from_attributes = True
