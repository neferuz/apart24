from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas import apartment as schemas
from app.crud import apartment as crud

router = APIRouter()

@router.get("/", response_model=List[schemas.Apartment])
def read_apartments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    apartments = crud.get_apartments(db, skip=skip, limit=limit)
    return apartments

@router.post("/", response_model=schemas.Apartment)
def create_apartment(apt: schemas.ApartmentCreate, db: Session = Depends(get_db)):
    return crud.create_apartment(db=db, apt=apt)

@router.get("/{apartment_id}", response_model=schemas.Apartment)
def read_apartment(apartment_id: int, db: Session = Depends(get_db)):
    db_apartment = crud.get_apartment(db, apartment_id=apartment_id)
    if db_apartment is None:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return db_apartment

@router.put("/{apartment_id}", response_model=schemas.Apartment)
def update_apartment(apartment_id: int, apt: schemas.ApartmentUpdate, db: Session = Depends(get_db)):
    db_apartment = crud.update_apartment(db, apartment_id=apartment_id, apt=apt)
    if db_apartment is None:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return db_apartment

@router.delete("/{apartment_id}")
def delete_apartment(apartment_id: int, db: Session = Depends(get_db)):
    success = crud.delete_apartment(db, apartment_id=apartment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return {"message": "Apartment deleted successfully"}
