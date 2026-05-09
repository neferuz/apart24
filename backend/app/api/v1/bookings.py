from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas import booking as schemas
from app.crud import booking as crud

router = APIRouter()

# --- CLIENTS ---
@router.get("/clients/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_clients(db, skip=skip, limit=limit)

@router.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = crud.get_client_by_tg_id(db, tg_id=client.tg_id)
    if db_client:
        changed = False
        if client.name and client.name != db_client.name:
            db_client.name = client.name
            changed = True
        if client.photo_url and client.photo_url != db_client.photo_url:
            db_client.photo_url = client.photo_url
            changed = True
            
        if changed:
            db.commit()
            db.refresh(db_client)
        return db_client
        
    return crud.create_client(db=db, client=client)

@router.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    success = crud.delete_client(db, client_id=client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}

# --- BOOKINGS ---
@router.get("/bookings/", response_model=List[schemas.Booking])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_bookings(db, skip=skip, limit=limit)

@router.post("/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    return crud.create_booking(db=db, booking=booking)

@router.put("/bookings/{booking_id}/status", response_model=schemas.Booking)
def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
    db_booking = crud.update_booking_status(db, booking_id=booking_id, status=status)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking
