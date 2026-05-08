from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import datetime
import enum

Base = declarative_base()

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PAID = "paid"
    DONE = "done"
    CANCELLED = "cancelled"

class ApartmentStatus(str, enum.Enum):
    FREE = "free"
    BUSY = "busy"
    REPAIR = "repair"

class Complex(Base):
    __tablename__ = "complexes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    lat = Column(String, nullable=True)
    lng = Column(String, nullable=True)
    image = Column(String, nullable=True)
    
    apartments = relationship("Apartment", back_populates="complex")

class Apartment(Base):
    __tablename__ = "apartments"
    id = Column(Integer, primary_key=True, index=True)
    complex_id = Column(Integer, ForeignKey("complexes.id"))
    title = Column(String)
    description = Column(String, nullable=True)
    address = Column(String)
    price = Column(Float)
    guests = Column(Integer)
    bedrooms = Column(Integer, default=1)
    bathrooms = Column(Integer, default=1)
    size = Column(String)
    lat = Column(String, nullable=True)
    lng = Column(String, nullable=True)
    status = Column(String, default=ApartmentStatus.FREE)
    image = Column(String, nullable=True)
    images = Column(String, nullable=True) # JSON list
    amenities = Column(String, nullable=True) # JSON list
    
    complex = relationship("Complex", back_populates="apartments")
    bookings = relationship("Booking", back_populates="apartment")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    tg_id = Column(String, unique=True, index=True)
    name = Column(String)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="client")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    apartment_id = Column(Integer, ForeignKey("apartments.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    total_price = Column(Float)
    status = Column(String, default=BookingStatus.PENDING)
    payment_method = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    apartment = relationship("Apartment", back_populates="bookings")
    client = relationship("Client", back_populates="bookings")
