const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const api = {
  // --- Catalog ---
  async getApartments() {
    const res = await fetch(`${API_URL}/apartments/`);
    if (!res.ok) throw new Error('Failed to fetch apartments');
    return res.json();
  },

  async getApartment(id: string) {
    const res = await fetch(`${API_URL}/apartments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch apartment details');
    return res.json();
  },

  async getComplexes() {
    const res = await fetch(`${API_URL}/complexes/`);
    if (!res.ok) throw new Error('Failed to fetch complexes');
    return res.json();
  },

  // --- Clients & Bookings ---
  async syncUser(userData: { tg_id: string; name: string; phone?: string; photo_url?: string }) {
    const res = await fetch(`${API_URL}/clients/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  async createBooking(bookingData: any) {
    const res = await fetch(`${API_URL}/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return res.json();
  },

  async getUserBookings(clientId: number) {
    const url = `${API_URL}/bookings/`;
    try {
      const [bookingsRes, apartmentsRes] = await Promise.all([
        fetch(url, { cache: 'no-store' }),
        fetch(`${API_URL}/apartments/`, { cache: 'no-store' })
      ]);
      
      if (!bookingsRes.ok || !apartmentsRes.ok) throw new Error('Failed to fetch data');
      
      const allBookings = await bookingsRes.json();
      const allApartments = await apartmentsRes.json();
      
      const userBookings = allBookings.filter((b: any) => String(b.client_id) === String(clientId));
      
      // Join with apartment details
      return userBookings.map((booking: any) => {
        const apt = allApartments.find((a: any) => a.id === booking.apartment_id);
        return {
          ...booking,
          apartment_title: apt?.title || "Апартаменты",
          apartment_image: apt?.image || "",
          apartment_address: apt?.address || "Ташкент"
        };
      });
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      throw err;
    }
  }
};
