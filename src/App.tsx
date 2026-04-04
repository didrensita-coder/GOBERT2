import React, { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login';
import { Layout } from './components/Layout/Layout';
import { Resumen } from './components/Dashboard/Resumen';
import { Inventario } from './components/Dashboard/Inventario';
import { AgregarEquipo } from './components/Dashboard/AgregarEquipo';
import { Modal } from './components/Common/Modal';
import { useAuth } from './context/AuthContext';
import { Equipo } from './types';
import { apiService } from './services/api';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('resumen');
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadEquipos();
    }
  }, [isAuthenticated]);

  const loadEquipos = async () => {
    try {
      const data = await apiService.getEquipos();
      setEquipos(data);
    } catch (error) {
      showNotification('Error al cargar equipos', 'error');
    }
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEquipoAgregado = () => {
    loadEquipos();
    setCurrentView('resumen');
    showNotification('Equipo registrado exitosamente', 'success');
  };

  const handleEquipoEditado = async (equipoActualizado: Equipo) => {
    try {
      await apiService.updateEquipo(equipoActualizado);
      await loadEquipos();
      setEditingEquipo(null);
      showNotification('Equipo actualizado exitosamente', 'success');
    } catch (error) {
      showNotification('Error al actualizar el equipo', 'error');
    }
  };

  const handleEquipoEliminado = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este equipo?')) {
      try {
        await apiService.deleteEquipo(id);
        await loadEquipos();
        showNotification('Equipo eliminado exitosamente', 'success');
      } catch (error) {
        showNotification('Error al eliminar el equipo', 'error');
      }
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'resumen' && <Resumen equipos={equipos} />}
        {currentView === 'inventario' && (
          <Inventario
            equipos={equipos}
            onEdit={setEditingEquipo}
            onDelete={handleEquipoEliminado}
          />
        )}
        {currentView === 'agregar' && (
          <AgregarEquipo
            onEquipoAgregado={handleEquipoAgregado}
            limiteAlcanzado={equipos.length >= 999}
          />
        )}
      </Layout>

      <Modal
        isOpen={!!editingEquipo}
        onClose={() => setEditingEquipo(null)}
        title="Editar Equipo"
      >
        {editingEquipo && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEquipoEditado(editingEquipo);
            }}
          >
            {/* Formulario de edición - similar al de AgregarEquipo */}
            <div className="form-grid">
              <div className="form-group">
                <label>Código</label>
                <input type="text" value={editingEquipo.codigo_equipo} disabled />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <input
                  type="text"
                  value={editingEquipo.tipo}
                  onChange={(e) => setEditingEquipo({ ...editingEquipo, tipo: e.target.value })}
                />
              </div>
              {/* Agrega los demás campos similares */}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingEquipo(null)}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </>
  );
};

export default App;