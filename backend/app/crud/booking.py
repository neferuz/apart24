from sqlalchemy.orm import Session
from app.models import models
from app.schemas import booking as schemas
from app.services.telegram_bot import notify_booking_created, notify_status_change

# --- CLIENT CRUD ---
def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_client_by_tg_id(db: Session, tg_id: str):
    return db.query(models.Client).filter(models.Client.tg_id == tg_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(
        tg_id=client.tg_id,
        name=client.name,
        phone=client.phone,
        photo_url=client.photo_url
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

from app.services.telegram_bot import notify_booking_created, notify_status_change

# --- BOOKING CRUD ---
def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Booking).order_by(models.Booking.created_at.desc()).offset(skip).limit(limit).all()

def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Send TG notification
    try:
        client = get_client(db, db_booking.client_id)
        apartment = db.query(models.Apartment).filter(models.Apartment.id == db_booking.apartment_id).first()
        if client and client.tg_id:
            notify_booking_created(str(client.tg_id), db_booking.id, apartment.title if apartment else "апартаменты")
    except Exception as e:
        print(f"Failed to send booking creation notification: {e}")
        
    return db_booking

def update_booking_status(db: Session, booking_id: int, status: str):
    db_booking = get_booking(db, booking_id)
    if db_booking:
        old_status = db_booking.status
        db_booking.status = status
        db.commit()
        db.refresh(db_booking)
        
        # Send TG notification if status changed
        if old_status != status:
            try:
                client = get_client(db, db_booking.client_id)
                if client and client.tg_id:
                    notify_status_change(str(client.tg_id), db_booking.id, status)
            except Exception as e:
                print(f"Failed to send status update notification: {e}")
                
    return db_booking
