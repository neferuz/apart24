from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas import complex as schemas
from app.crud import complex as crud

router = APIRouter()

@router.get("/", response_model=List[schemas.Complex])
def read_complexes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_complexes(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Complex)
def create_complex(comp: schemas.ComplexCreate, db: Session = Depends(get_db)):
    return crud.create_complex(db=db, comp=comp)

@router.get("/{complex_id}", response_model=schemas.Complex)
def read_complex(complex_id: int, db: Session = Depends(get_db)):
    db_complex = crud.get_complex(db, complex_id=complex_id)
    if db_complex is None:
        raise HTTPException(status_code=404, detail="Complex not found")
    return db_complex

@router.put("/{complex_id}", response_model=schemas.Complex)
def update_complex(complex_id: int, comp: schemas.ComplexUpdate, db: Session = Depends(get_db)):
    db_complex = crud.update_complex(db, complex_id=complex_id, comp=comp)
    if db_complex is None:
        raise HTTPException(status_code=404, detail="Complex not found")
    return db_complex

@router.delete("/{complex_id}")
def delete_complex(complex_id: int, db: Session = Depends(get_db)):
    success = crud.delete_complex(db, complex_id=complex_id)
    if not success:
        raise HTTPException(status_code=404, detail="Complex not found")
    return {"message": "Complex deleted successfully"}
