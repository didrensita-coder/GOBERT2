# Sistema de Inventario de Equipos

Sistema completo para gestión de inventario de equipos computacionales con roles de usuario (Admin/Coordinador).

## 🚀 Tecnologías

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite + TailwindCSS
- **Base de Datos:** SQLite
- **Autenticación:** Sesiones Django

## 📋 Requisitos Previos

- Python 3.10+
- Node.js 18+

## 🔧 Instalación

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python manage.py makemigrations core
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver