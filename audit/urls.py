from django.urls import path
from . import views

urlpatterns = [
    path('logs/', views.get_audit_logs, name='audit_logs'),
]