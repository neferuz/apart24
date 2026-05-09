from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas import notification as schemas
from app.crud import notification as crud

router = APIRouter()

@router.get("/{client_id}", response_model=List[schemas.Notification])
def read_notifications(client_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_notifications(db, client_id=client_id, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Notification)
def create_notification(notif: schemas.NotificationCreate, db: Session = Depends(get_db)):
    return crud.create_notification(db=db, notif=notif)

@router.put("/{notification_id}/read", response_model=schemas.Notification)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    db_notif = crud.mark_as_read(db, notification_id=notification_id)
    if db_notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notif

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    success = crud.delete_notification(db, notification_id=notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted successfully"}
