from django.urls import path
from . import views

urlpatterns = [
    path('prescribe/', views.prescribe_medication, name='prescribe_medication'),
    path('prescriptions/<int:prescription_id>/request_refill/', views.request_refill, name='request_refill'),
]