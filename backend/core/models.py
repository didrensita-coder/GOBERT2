from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    """Modelo personalizado de usuario"""
    ROLES = [
        ('admin', 'Administrador'),
        ('coordinador', 'Coordinador'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROLES, default='coordinador')
    telefono = models.CharField(max_length=20, blank=True)
    departamento = models.CharField(max_length=100, blank=True)
    foto_perfil = models.ImageField(upload_to='perfiles/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"


class Equipo(models.Model):
    ESTADO_CHOICES = [
        ('bueno', '✅ Bueno'),
        ('regular', '⚠️ Regular'),
        ('malo', '❌ Malo'),
        
    ]
    
    TIPO_CHOICES = [
        ('computadora_escritorio', 'Computadora de Escritorio'),
        ('laptop', 'Laptop'),
        ('servidor', 'Servidor'),
        ('impresora', 'Impresora'),
        ('monitor', 'Monitor'),
        ('tablet', 'Tablet'),
        ('telefono', 'Teléfono'),
        ('otro', 'Otro'),
    ]
    
    USO_CHOICES = [
        ('critico', '🔴 Crítico'),
        ('importante', '🟡 Importante'),
        ('basico', '🟢 Básico'),
    ]
    
    # Datos generales
    codigo_equipo = models.CharField(max_length=50, unique=True)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    ubicacion = models.CharField(max_length=200)
    usuario_asignado = models.CharField(max_length=200)
    uso = models.CharField(max_length=20, choices=USO_CHOICES, default='basico')
    
    # Especificaciones técnicas (para computadoras)
    procesador = models.CharField(max_length=200, blank=True, default='N/A')
    ram = models.CharField(max_length=100, blank=True, default='N/A')
    disco_duro = models.CharField(max_length=200, blank=True, default='N/A')
    sistema_operativo = models.CharField(max_length=200, blank=True, default='N/A')
    foto = models.ImageField(upload_to='equipos/', blank=True, null=True)
    
    # Campos específicos para impresoras
    marca = models.CharField(max_length=100, blank=True, default='')
    modelo = models.CharField(max_length=100, blank=True, default='')
    serial = models.CharField(max_length=100, blank=True, default='')
    
    # Campos específicos para monitores
    tamano = models.CharField(max_length=50, blank=True, default='')
    resolucion = models.CharField(max_length=50, blank=True, default='')
    tipo_pantalla = models.CharField(max_length=50, blank=True, default='')
    puertos = models.CharField(max_length=200, blank=True, default='')
    
    # Estado
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='bueno')
    observaciones = models.TextField(blank=True, default='')
    
    # Metadatos
    fecha_registro = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipos_registrados')
    
    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.codigo_equipo} - {self.tipo}"