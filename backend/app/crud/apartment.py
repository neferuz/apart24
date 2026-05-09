from sqlalchemy.orm import Session
from app.models import models
from app.schemas import apartment

def get_apartment(db: Session, apartment_id: int):
    return db.query(models.Apartment).filter(models.Apartment.id == apartment_id).first()

def get_apartments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Apartment).order_by(models.Apartment.sort_order).offset(skip).limit(limit).all()

def create_apartment(db: Session, apt: apartment.ApartmentCreate):
    db_apartment = models.Apartment(**apt.dict())
    db.add(db_apartment)
    db.commit()
    db.refresh(db_apartment)
    return db_apartment

def update_apartment(db: Session, apartment_id: int, apt: apartment.ApartmentUpdate):
    db_apartment = get_apartment(db, apartment_id)
    if db_apartment:
        update_data = apt.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_apartment, key, value)
        db.commit()
        db.refresh(db_apartment)
    return db_apartment

def delete_apartment(db: Session, apartment_id: int):
    db_apartment = get_apartment(db, apartment_id)
    if db_apartment:
        db.delete(db_apartment)
        db.commit()
        return True
    return False
