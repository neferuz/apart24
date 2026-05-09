from sqlalchemy.orm import Session
from app.models import models
from app.schemas import complex as schemas

def get_complex(db: Session, complex_id: int):
    return db.query(models.Complex).filter(models.Complex.id == complex_id).first()

def get_complexes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Complex).order_by(models.Complex.sort_order).offset(skip).limit(limit).all()

def create_complex(db: Session, comp: schemas.ComplexCreate):
    db_complex = models.Complex(**comp.dict())
    db.add(db_complex)
    db.commit()
    db.refresh(db_complex)
    return db_complex

def update_complex(db: Session, complex_id: int, comp: schemas.ComplexUpdate):
    db_complex = get_complex(db, complex_id)
    if db_complex:
        update_data = comp.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_complex, key, value)
        db.commit()
        db.refresh(db_complex)
    return db_complex

def delete_complex(db: Session, complex_id: int):
    db_complex = get_complex(db, complex_id)
    if db_complex:
        db.delete(db_complex)
        db.commit()
        return True
    return False
