from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.analytics_summary, name='analytics_summary'),
    path('system/status/', views.system_status, name='system_status'),
]