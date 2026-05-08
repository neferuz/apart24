from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import booking as crud
from app.services.telegram_bot import send_welcome

router = APIRouter()

@router.post("/send-message")
async def send_custom_message(payload: dict):
    tg_id = payload.get("tg_id")
    text = payload.get("text")
    
    if not tg_id or not text:
        return {"error": "Missing tg_id or text"}, 400
        
    from app.services.telegram_bot import send_message
    send_message(str(tg_id), text)
    
    return {"status": "sent"}

@router.post("/webhook")
async def telegram_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    
    if "message" in data:
        message = data["message"]
        chat_id = message["chat"]["id"]
        
        # Handle /start command
        if "text" in message and message["text"] == "/start":
            send_welcome(str(chat_id))
            
        # Handle shared contact
        elif "contact" in message:
            contact = message["contact"]
            phone = contact.get("phone_number")
            tg_id = str(contact.get("user_id", chat_id))
            
            # Update user in DB
            db_client = crud.get_client_by_tg_id(db, tg_id)
            if db_client:
                db_client.phone = phone
                db.commit()
                # Notify user
                from app.services.telegram_bot import send_message
                send_message(tg_id, "✅ <b>Ваш номер телефона успешно подтвержден!</b>\nТеперь вы можете бронировать апартаменты.")
            
    return {"status": "ok"}
