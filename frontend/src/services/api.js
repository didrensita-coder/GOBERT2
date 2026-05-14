// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
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
            const userWithPhoto = {
                ...response.data.user,
                foto_perfil: response.data.user.foto_perfil || null
            };
            localStorage.setItem('user', JSON.stringify(userWithPhoto));
            return { success: true, user: userWithPhoto };
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

// ✅ FUNCIÓN CORREGIDA PARA createEquipo
export const createEquipo = async (equipo) => {
    try {
        // Si es FormData, usar fetch directamente (más confiable para archivos)
        if (equipo instanceof FormData) {
            const response = await fetch('/api/equipos/', {
                method: 'POST',
                body: equipo,
                credentials: 'include',
            });
            
            if (!response.ok) {
                let errorMessage = 'Error al crear equipo';
                try {
                    const error = await response.json();
                    errorMessage = error.message || error.detail || JSON.stringify(error);
                    console.error('Error response:', error);
                } catch (e) {
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                return { success: false, error: errorMessage };
            }
            
            const data = await response.json();
            return { success: true, data: data };
        }
        
        // Si es JSON normal, usar axios
        const response = await api.post('/equipos/', equipo);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error en createEquipo:', error);
        return { success: false, error: error.message };
    }
};

export const updateEquipo = async (id, equipo) => {
    try {
        const isFormData = equipo instanceof FormData;
        const config = { withCredentials: true };
        
        if (!isFormData) {
            config.headers = { 'Content-Type': 'application/json' };
        }
        
        const response = await api.put(`equipos/${id}/`, equipo, config);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error al actualizar:', error);
        return { success: false, error: error.response?.data?.message || error.message };
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
        const response = await api.get('equipos/exportar_excel/', { responseType: 'blob' });
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
        const response = await api.get('equipos/exportar_csv/', { responseType: 'blob' });
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

// ============================================
// PERFIL DE USUARIO
// ============================================

export const actualizarPerfil = async (formData) => {
    try {
        const response = await axios.put('/api/usuarios/actualizar_perfil/', formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, user: response.data.user };
        }
        return { success: false, error: response.data.message || 'Error al actualizar' };
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return { success: false, error: 'Error de conexión' };
    }
};

export const cambiarPassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.post('usuarios/cambiar_password/', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        
        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, error: response.data.message || 'Error al cambiar contraseña' };
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return { success: false, error: 'Error de conexión' };
    }
};

export const updateCurrentUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getAcciones = async () => {
    try {
        const response = await api.get('acciones/');
        return response.data;
    } catch (error) {
        console.error('Error al cargar acciones:', error);
        return [];
    }
};


// ============================================
// DEPARTAMENTOS
// ============================================

export const getDepartamentos = async () => {
    try {
        const response = await api.get('departamentos/');
        return response.data;
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
        return [];
    }
};

export const crearDepartamento = async (data) => {
    try {
        const response = await api.post('departamentos/', data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.response?.data?.message || 'Error al crear' };
    }
};

export const actualizarDepartamento = async (id, data) => {
    try {
        const response = await api.put(`departamentos/${id}/`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.response?.data?.message || 'Error al actualizar' };
    }
};

export const eliminarDepartamento = async (id) => {
    try {
        await api.delete(`departamentos/${id}/`);
        return { success: true };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: error.response?.data?.message || 'Error al eliminar' };
    }
};