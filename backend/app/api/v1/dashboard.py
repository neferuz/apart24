from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models import models
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Total Revenue (Confirmed or Done)
    total_revenue = db.query(func.sum(models.Booking.total_price)).filter(
        models.Booking.status.in_(["confirmed", "done"])
    ).scalar() or 0
    
    # New Bookings (Last 24h)
    yesterday = datetime.utcnow() - timedelta(days=1)
    new_bookings = db.query(func.count(models.Booking.id)).filter(
        models.Booking.created_at >= yesterday
    ).scalar() or 0
    
    # Total Apartments and Occupied
    total_apts = db.query(func.count(models.Apartment.id)).scalar() or 0
    occupied_apts = db.query(func.count(models.Apartment.id)).filter(
        models.Apartment.status == "busy"
    ).scalar() or 0
    
    occupancy_rate = (occupied_apts / total_apts * 100) if total_apts > 0 else 0
    
    # Clients count
    total_clients = db.query(func.count(models.Client.id)).scalar() or 0
    
    # --- Chart Data (Last 7 days) ---
    chart_data = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        count = db.query(func.count(models.Booking.id)).filter(
            func.date(models.Booking.created_at) == day
        ).scalar() or 0
        
        day_name = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day.weekday()]
        chart_data.append({"name": day_name, "bookings": count})
    
    # Top Properties
    top_properties = db.query(
        models.Apartment.title,
        func.count(models.Booking.id).label("booking_count"),
        models.Apartment.image
    ).join(models.Booking).group_by(models.Apartment.id).order_by(func.count(models.Booking.id).desc()).limit(3).all()

    return {
        "revenue": f"{total_revenue:,}",
        "new_bookings": new_bookings,
        "occupancy": f"{int(occupancy_rate)}%",
        "clients": total_clients,
        "chart_data": chart_data,
        "top_properties": [
            {"name": p[0], "bookings": p[1], "image": p[2]} for p in top_properties
        ]
    }
