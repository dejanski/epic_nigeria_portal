from django.urls import path
from . import views

urlpatterns = [
    path('prescribe/', views.prescribe_medication, name='prescribe_medication'),
    path('list/', views.list_prescriptions, name='list_prescriptions'),
    path('prescriptions/<int:prescription_id>/request_refill/', views.request_refill, name='request_refill'),
]