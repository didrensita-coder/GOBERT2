
from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # 👈 Agrega esta línea
from django.conf.urls.static import static  # 👈 Agrega esta línea

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

# 👇 Agrega estas líneas al final
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)