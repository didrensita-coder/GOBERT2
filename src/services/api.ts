const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    return this.request('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getEquipos(): Promise<Equipo[]> {
    return this.request('/equipos/');
  }

  async createEquipo(equipo: Omit<Equipo, '__backendId' | 'fecha_registro'>): Promise<Equipo> {
    return this.request('/equipos/', {
      method: 'POST',
      body: JSON.stringify(equipo),
    });
  }

  async updateEquipo(equipo: Equipo): Promise<Equipo> {
    return this.request(`/equipos/${equipo.__backendId}/`, {
      method: 'PUT',
      body: JSON.stringify(equipo),
    });
  }

  async deleteEquipo(id: number): Promise<void> {
    return this.request(`/equipos/${id}/`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();