const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const api = {
  // --- Complexes ---
  async getComplexes() {
    const res = await fetch(`${API_URL}/complexes/`);
    if (!res.ok) throw new Error('Failed to fetch complexes');
    return res.json();
  },

  async createComplex(data: any) {
    const res = await fetch(`${API_URL}/complexes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateComplex(id: number, data: any) {
    const res = await fetch(`${API_URL}/complexes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteComplex(id: number) {
    const res = await fetch(`${API_URL}/complexes/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // --- Apartments ---
  async getApartments() {
    const res = await fetch(`${API_URL}/apartments/`);
    if (!res.ok) throw new Error('Failed to fetch apartments');
    return res.json();
  },

  async createApartment(data: any) {
    const res = await fetch(`${API_URL}/apartments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteApartment(id: number) {
    const res = await fetch(`${API_URL}/apartments/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async updateApartment(id: number, data: any) {
    const res = await fetch(`${API_URL}/apartments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // --- Bookings ---
  async getBookings() {
    try {
      const [bookingsRes, apartmentsRes, clientsRes] = await Promise.all([
        fetch(`${API_URL}/bookings/`, { cache: 'no-store' }),
        fetch(`${API_URL}/apartments/`, { cache: 'no-store' }),
        fetch(`${API_URL}/clients/`, { cache: 'no-store' })
      ]);
      
      if (!bookingsRes.ok || !apartmentsRes.ok || !clientsRes.ok) throw new Error('Failed to fetch data');
      
      const bookings = await bookingsRes.json();
      const apartments = await apartmentsRes.json();
      const clients = await clientsRes.json();
      
      return bookings.map((b: any) => ({
        ...b,
        apartment: apartments.find((a: any) => a.id === b.apartment_id),
        client: clients.find((c: any) => c.id === b.client_id)
      }));
    } catch (err) {
      console.error("Error in getBookings:", err);
      return [];
    }
  },

  async updateBookingStatus(id: number, status: string) {
    const res = await fetch(`${API_URL}/bookings/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  // --- Clients ---
  async getClients() {
    const res = await fetch(`${API_URL}/clients/`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async getClient(id: number | string) {
    const clients = await this.getClients();
    return clients.find((c: any) => String(c.id) === String(id));
  },

  async getClientBookings(id: number | string) {
    const bookings = await this.getBookings();
    return bookings.filter((b: any) => String(b.client_id) === String(id));
  },
  
  async deleteClient(id: number) {
    const res = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // --- Dashboard ---
  async getStats() {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  // --- Upload ---
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/upload/`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async sendMessage(tg_id: string, text: string) {
    const response = await fetch(`${API_URL}/bot/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tg_id, text }),
    });
    return response.json();
  }
};
