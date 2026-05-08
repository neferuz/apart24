from pydantic import BaseModel
from typing import Optional, List

class ComplexBase(BaseModel):
    name: str
    address: str
    lat: Optional[str] = None
    lng: Optional[str] = None
    image: Optional[str] = None

class ComplexCreate(ComplexBase):
    pass

class ComplexUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[str] = None
    lng: Optional[str] = None
    image: Optional[str] = None

class Complex(ComplexBase):
    id: int

    class Config:
        from_attributes = True
