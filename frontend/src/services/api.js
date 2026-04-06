import axios from 'axios';

// Usar URL relativa para que use el proxy
const api = axios.create({
    baseURL: '/api/',  // ← Cambiado a relativa
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ============================================
// AUTENTICACIÓN
// ============================================

export const login = async (username, password) => {
    try {
        const response = await api.post('login/', { username, password });
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, user: response.data.user };
        }
        return { success: false, error: 'Credenciales incorrectas' };
    } catch (error) {
        console.error('Error de login:', error);
        return { success: false, error: 'Error de conexión' };
    }
};

export const logout = async () => {
    try {
        await api.post('logout/');
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};

export const verificarAuth = async () => {
    const user = localStorage.getItem('user');
    if (user) {
        return { authenticated: true, user: JSON.parse(user) };
    }
    return { authenticated: false };
};

// ============================================
// EQUIPOS
// ============================================

export const getEquipos = async () => {
    try {
        const response = await api.get('equipos/');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const getStats = async () => {
    try {
        const response = await api.get('equipos/stats/');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const createEquipo = async (equipo) => {
    try {
        const response = await api.post('equipos/', equipo);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateEquipo = async (id, equipo) => {
    try {
        const response = await api.put(`equipos/${id}/`, equipo);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteEquipo = async (id) => {
    try {
        await api.delete(`equipos/${id}/`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const exportarExcel = async () => {
    try {
        const response = await api.get('equipos/exportar_excel/', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'equipos.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};

export const exportarCSV = async () => {
    try {
        const response = await api.get('equipos/exportar_csv/', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'equipos.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};

// ============================================
// USUARIOS
// ============================================

export const getUsuarios = async () => {
    try {
        const response = await api.get('usuarios/');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const registrarCoordinador = async (userData) => {
    try {
        const response = await api.post('usuarios/registrar_coordinador/', userData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.response?.data?.error || 'Error al registrar' };
    }
};

export const deleteUsuario = async (id) => {
    try {
        await api.delete(`usuarios/${id}/`);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};