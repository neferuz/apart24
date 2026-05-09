import json
import urllib.request
import urllib.parse
import os

BOT_TOKEN = "8116683623:AAFJUkrkawLf6-4nNAkYEIDzNa8FZaEY1Cw"
WEBAPP_URL = "https://apart24.uz" 

def send_message(chat_id: str, text: str, reply_markup: dict = None):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            return response.read()
    except Exception as e:
        print(f"Error sending TG message: {e}")

def send_welcome(chat_id: str):
    text = (
        "<b>Добро пожаловать в Apart24!</b>\n\n"
        "Ваш надежный партнер по поиску премиального жилья в Ташкенте. ✨\n\n"
        "🏡 <b>Почему выбирают нас?</b>\n"
        "• Только проверенные апартаменты\n"
        "• Прозрачные условия бронирования\n"
        "• Поддержка 24/7\n\n"
        "Нажмите на кнопку ниже, чтобы начать поиск своего идеального места!"
    )
    
    reply_markup = {
        "inline_keyboard": [
            [
                {
                    "text": "🏨 Забронировать жилье",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "📱 Наш канал",
                    "url": "https://t.me/apart24_channel"
                }
            ]
        ]
    }
    
    send_message(chat_id, text, reply_markup)

def notify_booking_created(chat_id: str, booking_id: int, apartment_title: str):
    text = (
        "<b>Ваша заявка принята!</b> ✅\n\n"
        "Вы забронировали: <b>{apartment_title}</b>\n"
        "Номер брони: <code>#{booking_id}</code>\n\n"
        "<i>Пожалуйста, ожидайте ответа администратора. Мы свяжемся с вами в ближайшее время.</i>"
    ).format(apartment_title=apartment_title, booking_id=booking_id)
    
    send_message(chat_id, text)

def notify_status_change(chat_id: str, booking_id: int, status: str):
    status_map = {
        "confirmed": "Подтверждено ✅",
        "cancelled": "Отменено ❌",
        "done": "Завершено ✨",
        "pending": "В ожидании ⏳"
    }
    
    status_text = status_map.get(status.lower(), status)
    
    text = (
        "<b>Обновление статуса брони #{booking_id}</b>\n\n"
        "Новый статус: <b>{status_text}</b>"
    ).format(booking_id=booking_id, status_text=status_text)
    
    send_message(chat_id, text)
