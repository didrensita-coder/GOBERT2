from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Equipo

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


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ['codigo_equipo', 'tipo', 'ubicacion', 'usuario_asignado', 'estado']
    list_filter = ['estado', 'tipo', 'ubicacion']
    search_fields = ['codigo_equipo', 'usuario_asignado', 'ubicacion']
    readonly_fields = ['fecha_registro']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.registrado_por = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Usuario, CustomUserAdmin)