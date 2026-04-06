from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, Equipo


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializador para listar/ver usuarios"""
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'telefono', 'departamento']
        read_only_fields = ['id']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    """Serializador para registrar nuevos usuarios (coordinadores)"""
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'rol', 'telefono', 'departamento']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializador para login"""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Usuario o contraseña incorrectos")
        if not user.is_active:
            raise serializers.ValidationError("Usuario desactivado")
        return {'user': user}


class EquipoSerializer(serializers.ModelSerializer):
    """Serializador para equipos"""
    registrado_por_nombre = serializers.SerializerMethodField()
    estado_display = serializers.SerializerMethodField()
    tipo_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipo
        fields = '__all__'
        read_only_fields = ['fecha_registro', 'registrado_por']
    
    def get_registrado_por_nombre(self, obj):
        return obj.registrado_por.username if obj.registrado_por else 'Sistema'
    
    def get_estado_display(self, obj):
        estados = {
            'bueno': '✅ Bueno',
            'regular': '⚠️ Regular',
            'malo': '❌ Malo'
        }
        return estados.get(obj.estado, obj.estado)
    
    def get_tipo_display(self, obj):
        tipos = {
            'computadora_escritorio': 'Computadora de Escritorio',
            'laptop': 'Laptop',
            'servidor': 'Servidor',
            'impresora': 'Impresora',
            'monitor': 'Monitor',
            'tablet': 'Tablet',
            'telefono': 'Teléfono',
            'otro': 'Otro'
        }
        return tipos.get(obj.tipo, obj.tipo)