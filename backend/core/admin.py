# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Equipo, Departamento

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_active')
    list_filter = ('rol', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('rol', 'telefono', 'departamento'),
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {
            'fields': ('rol', 'telefono', 'departamento', 'email', 'first_name', 'last_name'),
        }),
    )


@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'piso', 'activo', 'fecha_creacion']
    list_filter = ['piso', 'activo']
    search_fields = ['nombre']
    ordering = ['piso', 'nombre']


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ['codigo_equipo', 'tipo', 'usuario_asignado', 'get_departamento', 'get_piso', 'estado', 'uso', 'fecha_registro']
    list_filter = ['estado', 'tipo', 'uso', 'piso']
    search_fields = ['codigo_equipo', 'usuario_asignado', 'departamento__nombre']
    readonly_fields = ['fecha_registro']
    
    def get_departamento(self, obj):
        return obj.departamento.nombre if obj.departamento else '-'
    get_departamento.short_description = 'Departamento'
    
    def get_piso(self, obj):
        return obj.piso or '-'
    get_piso.short_description = 'Piso'
    
    fieldsets = (
        ('Información General', {
            'fields': ('codigo_equipo', 'tipo', 'uso')
        }),
        ('Ubicación', {
            'fields': ('piso', 'departamento')
        }),
        ('Asignación', {
            'fields': ('usuario_asignado',)
        }),
        ('Especificaciones Técnicas', {
            'fields': ('procesador', 'ram', 'disco_duro', 'sistema_operativo'),
            'classes': ('collapse',)
        }),
        ('Datos Específicos', {
            'fields': ('marca', 'modelo', 'serial', 'tamano', 'resolucion', 'tipo_pantalla', 'puertos'),
            'classes': ('collapse',)
        }),
        ('Estado y Observaciones', {
            'fields': ('estado', 'observaciones', 'foto')
        }),
        ('Metadatos', {
            'fields': ('fecha_registro', 'registrado_por'),
            'classes': ('collapse',)
        }),
    )


admin.site.register(Usuario, CustomUserAdmin)