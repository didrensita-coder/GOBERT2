from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipoViewSet, UserViewSet, LoginView, LogoutView, VerificarAuthView

router = DefaultRouter()
router.register(r'equipos', EquipoViewSet)
router.register(r'usuarios', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verificar/', VerificarAuthView.as_view(), name='verificar'),
]