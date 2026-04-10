from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.http import HttpResponse
from .models import Usuario, Equipo
from .serializers import (
    UsuarioSerializer, RegistroUsuarioSerializer, 
    LoginSerializer, EquipoSerializer
)
import csv
from io import BytesIO

# ============================================
# PERMISOS PERSONALIZADOS
# ============================================

class IsAdminUser(permissions.BasePermission):
    """Permiso solo para administradores"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'admin'

class IsAdminOrReadOnly(permissions.BasePermission):
    """Admin: todo | Coordinador: solo lectura"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.rol == 'admin'


# ============================================
# VISTAS DE AUTENTICACIÓN
# ============================================

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print("=== INTENTO DE LOGIN ===")
        print(f"Datos: {request.data}")
        
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            print(f"✅ Login exitoso: {user.username}")
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'rol': user.rol,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            })
        print(f"❌ Error: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': True})


@method_decorator(csrf_exempt, name='dispatch')
class VerificarAuthView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'authenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'rol': request.user.rol,
                }
            })
        return Response({'authenticated': False})


# ============================================
# VISTAS DE USUARIOS
# ============================================

@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def registrar_coordinador(self, request):
        """Registrar nuevo coordinador (solo admin)"""
        print("=== REGISTRANDO COORDINADOR ===")
        print(f"Datos: {request.data}")
        
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print(f"✅ Coordinador creado: {user.username}")
            return Response(UsuarioSerializer(user).data, status=status.HTTP_201_CREATED)
        print(f"❌ Error: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtener usuario actual"""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)


# ============================================
# VISTAS DE EQUIPOS (CORREGIDO - PERMITE TODO)
# ============================================

@method_decorator(csrf_exempt, name='dispatch')
class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    
    def get_permissions(self):
        """Permite todas las operaciones sin autenticación para desarrollo"""
        # 👇 CAMBIADO: Ahora permite todo sin login
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        """Guarda el equipo, si hay usuario autenticado lo registra"""
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(registrado_por=user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de equipos"""
        equipos = Equipo.objects.all()
        stats = {
            'total': equipos.count(),
            'bueno': equipos.filter(estado='bueno').count(),
            'regular': equipos.filter(estado='regular').count(),
            'malo': equipos.filter(estado='malo').count(),
            'por_tipo': {},
            'por_ubicacion': {},
        }
        
        for equipo in equipos:
            tipo = equipo.get_tipo_display()
            stats['por_tipo'][tipo] = stats['por_tipo'].get(tipo, 0) + 1
            
            ubicacion = equipo.ubicacion
            stats['por_ubicacion'][ubicacion] = stats['por_ubicacion'].get(ubicacion, 0) + 1
        
        return Response(stats)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def exportar_excel(self, request):
        """Exportar equipos a Excel (solo admin)"""
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Equipos"
        
        headers = ['Código', 'Tipo', 'Ubicación', 'Usuario', 'Procesador', 'RAM', 'Disco', 'SO', 'Estado', 'Fecha']
        ws.append(headers)
        
        for cell in ws[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
            cell.alignment = Alignment(horizontal="center")
        
        for equipo in self.queryset:
            ws.append([
                equipo.codigo_equipo,
                equipo.get_tipo_display(),
                equipo.ubicacion,
                equipo.usuario_asignado,
                equipo.procesador,
                equipo.ram,
                equipo.disco_duro,
                equipo.sistema_operativo,
                equipo.get_estado_display(),
                equipo.fecha_registro.strftime('%Y-%m-%d')
            ])
        
        for column in ws.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 30)
            ws.column_dimensions[column_letter].width = adjusted_width
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="equipos.xlsx"'
        wb.save(response)
        return response
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def exportar_csv(self, request):
        """Exportar equipos a CSV (solo admin)"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="equipos.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Código', 'Tipo', 'Ubicación', 'Usuario', 'Procesador', 'RAM', 'Disco', 'SO', 'Estado', 'Fecha'])
        
        for equipo in self.queryset:
            writer.writerow([
                equipo.codigo_equipo,
                equipo.get_tipo_display(),
                equipo.ubicacion,
                equipo.usuario_asignado,
                equipo.procesador,
                equipo.ram,
                equipo.disco_duro,
                equipo.sistema_operativo,
                equipo.get_estado_display(),
                equipo.fecha_registro.strftime('%Y-%m-%d')
            ])
        
        return response
    
    