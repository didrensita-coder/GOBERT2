from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, Equipo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'telefono', 'departamento']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'rol', 'telefono', 'departamento']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = Usuario(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Credenciales inválidas")
        if not user.is_active:
            raise serializers.ValidationError("Usuario desactivado")
        data['user'] = user
        return data


class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'
        read_only_fields = ['id', 'fecha_registro']