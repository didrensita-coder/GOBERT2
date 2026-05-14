// utils/validarImagen.js

// Tamaños máximos (en MB)
const MAX_SIZE_MB = {
    perfil: 2,      // 2MB para foto de perfil
    equipo: 5,      // 5MB para foto de equipo
    general: 3      // 3MB para cualquier otra
};

// Formatos permitidos
const FORMATOS_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'webp'];

export const validarImagen = (file, tipo = 'general') => {
    // 1. Verificar que hay un archivo
    if (!file) {
        return { valid: false, error: 'No se seleccionó ningún archivo' };
    }

    // 2. Verificar el formato
    if (!FORMATOS_PERMITIDOS.includes(file.type)) {
        return { 
            valid: false, 
            error: `Formato no permitido. Formatos aceptados: JPG, JPEG, PNG, WEBP` 
        };
    }

    // 3. Verificar el tamaño según el tipo
    const maxSizeMB = MAX_SIZE_MB[tipo] || MAX_SIZE_MB.general;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        return { 
            valid: false, 
            error: `La imagen es demasiado grande. Máximo ${maxSizeMB}MB` 
        };
    }

    return { valid: true, error: null };
};

export const formatearTamaño = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const obtenerInformacionArchivo = (file) => {
    if (!file) return null;
    return {
        nombre: file.name,
        tamaño: formatearTamaño(file.size),
        tipo: file.type,
        ultimaModificacion: new Date(file.lastModified).toLocaleString()
    };
};