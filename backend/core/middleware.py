from django.utils.deprecation import MiddlewareMixin

class DisableCSRFMiddleware(MiddlewareMixin):
    """Deshabilita CSRF para todas las peticiones"""
    
    def process_request(self, request):
        # Deshabilita la verificación CSRF
        setattr(request, '_dont_enforce_csrf_checks', True)