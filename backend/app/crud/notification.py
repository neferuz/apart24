from sqlalchemy.orm import Session
from app.models import models
from app.schemas import notification

def get_notifications(db: Session, client_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Notification).filter(models.Notification.client_id == client_id).order_by(models.Notification.id.desc()).offset(skip).limit(limit).all()

def create_notification(db: Session, notif: notification.NotificationCreate):
    db_notif = models.Notification(**notif.dict())
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

def mark_as_read(db: Session, notification_id: int):
    db_notif = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if db_notif:
        db_notif.is_read = 1
        db.commit()
        db.refresh(db_notif)
    return db_notif

def delete_notification(db: Session, notification_id: int):
    db_notif = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if db_notif:
        db.delete(db_notif)
        db.commit()
        return True
    return False
