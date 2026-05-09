import os
import time
import requests
from sqlalchemy.orm import Session
import sys

# Add the current directory to the sys path so app modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.crud import booking as crud
from app.services.telegram_bot import send_welcome, send_message

BOT_TOKEN = "8116683623:AAFJUkrkawLf6-4nNAkYEIDzNa8FZaEY1Cw"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def process_update(update):
    db = SessionLocal()
    try:
        if "message" in update:
            message = update["message"]
            chat_id = message["chat"]["id"]
            
            if "text" in message and message["text"] == "/start":
                print(f"Sending welcome to {chat_id}")
                send_welcome(str(chat_id))
                
            elif "contact" in message:
                contact = message["contact"]
                phone = contact.get("phone_number")
                tg_id = str(contact.get("user_id", chat_id))
                
                print(f"Received contact {phone} from {tg_id}")
                db_client = crud.get_client_by_tg_id(db, tg_id)
                if db_client:
                    db_client.phone = phone
                    db.commit()
                    send_message(tg_id, "✅ <b>Ваш номер телефона успешно подтвержден!</b>\nТеперь вы можете бронировать апартаменты.")
    except Exception as e:
        print(f"Error processing update: {e}")
    finally:
        db.close()

def main():
    # First, delete any webhook so polling can work
    try:
        res = requests.get(f"{API_URL}/deleteWebhook?drop_pending_updates=true", timeout=10)
        print(f"Delete webhook response: {res.json()}")
    except Exception as e:
        print(f"Failed to delete webhook: {e}")
    
    offset = None
    print("Starting bot polling loop...")
    
    while True:
        try:
            url = f"{API_URL}/getUpdates?timeout=30"
            if offset:
                url += f"&offset={offset}"
                
            resp = requests.get(url, timeout=40)
            data = resp.json()
            
            if data.get("ok"):
                for update in data.get("result", []):
                    process_update(update)
                    offset = update["update_id"] + 1
            else:
                print(f"Telegram error: {data}")
                time.sleep(2)
                
        except requests.exceptions.RequestException as e:
            print(f"Network error: {e}")
            time.sleep(5)
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
