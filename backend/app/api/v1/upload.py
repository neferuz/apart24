from fastapi import APIRouter, UploadFile, File
import shutil
import os
import uuid

router = APIRouter()

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join("uploads", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{filename}"}
