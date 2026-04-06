from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Usuario(AbstractUser):
    """Modelo personalizado de usuario"""
    ROLES = [
        ('admin', 'Administrador'),
        ('coordinador', 'Coordinador'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROLES, default='coordinador')
    telefono = models.CharField(max_length=20, blank=True)
    departamento = models.CharField(max_length=100, blank=True)
    
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
    
    # Datos del equipo
    codigo_equipo = models.CharField(max_length=50, unique=True)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    ubicacion = models.CharField(max_length=200)
    usuario_asignado = models.CharField(max_length=200)
    
    # Especificaciones técnicas
    procesador = models.CharField(max_length=200, blank=True, default='N/A')
    ram = models.CharField(max_length=100, blank=True, default='N/A')
    disco_duro = models.CharField(max_length=200, blank=True, default='N/A')
    sistema_operativo = models.CharField(max_length=200, blank=True, default='N/A')
    
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