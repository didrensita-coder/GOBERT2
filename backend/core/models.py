# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

def validate_image_size_5mb(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:
        raise ValidationError('La imagen no puede superar los 5MB')

def validate_image_size_2mb(value):
    filesize = value.size
    if filesize > 2 * 1024 * 1024:
        raise ValidationError('La foto de perfil no puede superar los 2MB')

class Usuario(AbstractUser):
    ROLES = [
        ('admin', 'Administrador'),
        ('coordinador', 'Coordinador'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROLES, default='coordinador')
    telefono = models.CharField(max_length=20, blank=True)
    departamento = models.CharField(max_length=100, blank=True)
    foto_perfil = models.ImageField(
        upload_to='perfiles/', 
        null=True, 
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size_2mb
        ]
    )
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"


class Departamento(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    piso = models.CharField(max_length=50, blank=True, default='')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'
        ordering = ['piso', 'nombre']
    
    def __str__(self):
        return f"{self.nombre} ({self.piso})" if self.piso else self.nombre


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
        ('regulador', 'Regulador'),
        ('telefono', 'Teléfono'),
        ('otro', 'Otro'),
    ]
    
    USO_CHOICES = [
        ('critico', '🔴 Crítico'),
        ('importante', '🟡 Importante'),
        ('basico', '🟢 Básico'),
    ]
    
    codigo_equipo = models.CharField(max_length=50, unique=True)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    uso = models.CharField(max_length=20, choices=USO_CHOICES, default='basico')
    usuario_asignado = models.CharField(max_length=200)
    piso = models.CharField(max_length=50, blank=True, default='')
    departamento = models.ForeignKey(
        'Departamento', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='equipos'
    )
    
    procesador = models.CharField(max_length=200, blank=True, default='N/A')
    ram = models.CharField(max_length=100, blank=True, default='N/A')
    disco_duro = models.CharField(max_length=200, blank=True, default='N/A')
    sistema_operativo = models.CharField(max_length=200, blank=True, default='N/A')
    
    marca = models.CharField(max_length=100, blank=True, default='')
    modelo = models.CharField(max_length=100, blank=True, default='')
    serial = models.CharField(max_length=100, blank=True, default='')
    tamano = models.CharField(max_length=50, blank=True, default='')
    resolucion = models.CharField(max_length=50, blank=True, default='')
    tipo_pantalla = models.CharField(max_length=50, blank=True, default='')
    puertos = models.CharField(max_length=200, blank=True, default='')
    
    foto = models.ImageField(
        upload_to='equipos/', 
        null=True, 
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size_5mb
        ]
    )
    
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='bueno')
    observaciones = models.TextField(blank=True, default='')
    
    fecha_registro = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey('Usuario', on_delete=models.SET_NULL, null=True, blank=True, related_name='equipos_registrados')
    
    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['-fecha_registro']
    
    def __str__(self):
        depto_nombre = self.departamento.nombre if self.departamento else 'Sin departamento'
        return f"{self.codigo_equipo} - {self.tipo} - {depto_nombre}"


class Accion(models.Model):
    TIPO_ACCION = [
        ('creacion', '➕ Creación'),
        ('edicion', '✏️ Edición'),
        ('eliminacion', '🗑️ Eliminación'),
        ('login', '🔐 Inicio de Sesión'),
        ('logout', '🚪 Cierre de Sesión'),
    ]
    
    ENTIDAD_CHOICES = [
        ('equipo', 'Equipo'),
        ('usuario', 'Usuario'),
        ('perfil', 'Perfil'),
        ('departamento', 'Departamento'),
    ]
    
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='acciones')
    tipo = models.CharField(max_length=20, choices=TIPO_ACCION)
    entidad = models.CharField(max_length=20, choices=ENTIDAD_CHOICES)
    entidad_id = models.IntegerField(null=True, blank=True)
    descripcion = models.TextField()
    ip = models.GenericIPAddressField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Acción'
        verbose_name_plural = 'Registro de Acciones'
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.tipo} - {self.fecha}"