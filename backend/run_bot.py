import os
import time
import json
import urllib.request
import urllib.parse
from sqlalchemy.orm import Session
import sys

# Add the current directory to the sys path so app modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.crud import booking as crud
from app.services.telegram_bot import send_welcome, send_message

BOT_TOKEN = "8116683623:AAFJUkrkawLf6-4nNAkYEIDzNa8FZaEY1Cw"
API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def tg_request(method, params=None):
    url = f"{API_URL}/{method}"
    if params:
        # Use POST for everything to be safer and avoid long URL issues
        data = urllib.parse.urlencode(params).encode('utf-8')
        req = urllib.request.Request(url, data=data)
    else:
        req = urllib.request.Request(url)
    
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"TG API Request Error ({method}): {e}")
        return None

def process_update(update):
    db = SessionLocal()
    try:
        if "message" in update:
            message = update["message"]
            chat_id = message["chat"]["id"]
            
            if "text" in message:
                text = message["text"]
                if text.startswith("/start"):
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
    # Only delete webhook once, and DON'T drop pending updates unless you really have to
    print("Initializing bot...")
    tg_request("deleteWebhook")
    
    offset = 0
    print("Starting bot polling loop...")
    
    while True:
        try:
            params = {"timeout": 30}
            if offset:
                params["offset"] = offset
                
            data = tg_request("getUpdates", params)
            
            if data and data.get("ok"):
                result = data.get("result", [])
                if result:
                    print(f"Received {len(result)} updates")
                    for update in result:
                        print(f"Processing update: {update.get('update_id')}")
                        process_update(update)
                        offset = update["update_id"] + 1
            else:
                if data:
                    print(f"Telegram error or empty response: {data}")
                time.sleep(1)
                
        except Exception as e:
            print(f"Unexpected error in main loop: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
