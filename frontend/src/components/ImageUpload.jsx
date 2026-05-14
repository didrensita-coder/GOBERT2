// components/ImageUpload.jsx
import React, { useState, useEffect } from 'react';
import { Upload, Camera, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { validarImagen } from '../utils/validarImagen';

const ImageUpload = ({ 
    onImageChange, 
    currentImage = null, 
    tipo = 'equipo', 
    label = 'Foto del Equipo'
}) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (currentImage && typeof currentImage === 'string') {
            setPreview(currentImage);
        }
    }, [currentImage]);

    const maxSize = tipo === 'perfil' ? '2MB' : '5MB';
    const formatos = 'PNG, JPG, JPEG, WEBP';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validation = validarImagen(file, tipo);
            if (!validation.valid) {
                setError(validation.error);
                onImageChange(null);
                setFileName('');
                e.target.value = '';
                return;
            }
            
            setError(null);
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageChange(null);
        setError(null);
        setFileName('');
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
                <span className="text-gray-400 text-xs font-normal ml-2">
                    ({maxSize} máx, {formatos})
                </span>
            </label>
            
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all
                ${error ? 'border-red-400 bg-red-50' : 
                  preview ? 'border-green-400 bg-green-50' : 
                  'border-gray-300 hover:border-blue-400 bg-gray-50'}`}>
                
                {preview ? (
                    <div className="relative">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="mx-auto max-h-48 rounded-lg shadow-lg object-contain" 
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-md"
                            title="Eliminar imagen"
                        >
                            <X size={16} />
                        </button>
                        {fileName && (
                            <p className="mt-2 text-xs text-gray-500">{fileName}</p>
                        )}
                        <p className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                            ✓ Imagen cargada exitosamente
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-gray-100">
                                <ImageIcon size={40} className="text-gray-400" />
                            </div>
                        </div>
                        <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg hover:shadow-lg inline-flex items-center gap-2 transition transform hover:scale-105">
                            <Upload size={18} />
                            Seleccionar imagen
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        
                        {error && (
                            <div className="mt-3 p-2 bg-red-100 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                                    <AlertCircle size={14} /> {error}
                                </p>
                            </div>
                        )}
                        
                        <div className="mt-4 flex justify-center gap-3 text-xs text-gray-400">
                            <span>📷 Formatos: {formatos}</span>
                            <span>💾 Máximo: {maxSize}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;