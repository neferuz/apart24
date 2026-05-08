import datetime
import random
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models import models

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Clean old data
    db.query(models.Booking).delete()
    db.query(models.Apartment).delete()
    db.query(models.Client).delete()
    db.query(models.Complex).delete()
    db.commit()
    
    # 1. Create Complexes
    complexes = [
        models.Complex(name="ЖК Лазурный", address="Ул. Приморская, 45", image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"),
        models.Complex(name="ЖК Океан", address="Пр-кт Мира, 102", image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"),
        models.Complex(name="ЖК Парк Авеню", address="Парковая зона, 12", image="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&q=80")
    ]
    db.add_all(complexes)
    db.commit()
    
    # 2. Create Apartments
    apart_images = [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1580587767303-9bbef0000000?w=800&q=80"
    ]
    
    apartments = []
    for i, c in enumerate(complexes):
        for j in range(3):
            img_idx = (i * 3 + j) % len(apart_images)
            apt = models.Apartment(
                complex_id=c.id,
                title=f"Апартаменты {j+1} в {c.name}",
                description=f"Превосходные апартаменты в элитном комплексе {c.name}. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.",
                address=f"{c.address}, кв. {random.randint(1, 200)}",
                price=random.randint(3, 8) * 1000000,
                guests=random.randint(2, 6),
                bedrooms=random.randint(1, 3),
                bathrooms=random.randint(1, 2),
                size=f"{random.randint(35, 95)} м²",
                lat=c.lat or "41.311081",
                lng=c.lng or "69.240562",
                status=random.choice(["free", "free", "busy", "repair"]),
                image=apart_images[img_idx],
                amenities="Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд"
            )
            apartments.append(apt)
    db.add_all(apartments)
    db.commit()
    
    # 3. Create Clients
    clients = [
        models.Client(tg_id="12345678", name="Александр Волков", phone="+998 90 123 45 67"),
        models.Client(tg_id="87654321", name="Мария Соколова", phone="+998 90 987 65 43"),
        models.Client(tg_id="11223344", name="Иван Петров", phone="+998 90 555 55 55")
    ]
    db.add_all(clients)
    db.commit()
    
    # 4. Create Bookings
    for i in range(25):
        day_offset = random.randint(0, 10)
        created_at = datetime.datetime.now(datetime.UTC) - datetime.timedelta(days=day_offset)
        
        booking = models.Booking(
            apartment_id=random.choice(apartments).id,
            client_id=random.choice(clients).id,
            check_in=created_at + datetime.timedelta(days=1),
            check_out=created_at + datetime.timedelta(days=4),
            total_price=random.randint(10, 30) * 100000,
            status=random.choice(["confirmed", "done", "pending", "cancelled"]),
            payment_method="Payme",
            created_at=created_at
        )
        db.add(booking)
    
    db.commit()
    db.close()
    print("Database re-seeded with beautiful photos!")

if __name__ == "__main__":
    seed()
