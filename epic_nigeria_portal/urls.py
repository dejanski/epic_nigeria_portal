"""
URL configuration for epic_nigeria_portal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(url='/api/docs/', permanent=False)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    
    path('api/patients/', include('patients.urls')),
    path('api/clinical/', include('clinical.urls')),
    path('api/medications/', include('medications.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/analytics/', include('analytics.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # ... existing ...
    path('api/appointments/', include('appointments.urls')),
    path('api/labs/', include('labs.urls')),
    path('api/messaging/', include('messaging.urls')),
    path('api/audit/', include('audit.urls')),
    path('api/accounts/', include('accounts.urls')),
]