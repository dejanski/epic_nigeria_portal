from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_appointment, name='create_appointment'),
    path('list/', views.list_appointments, name='list_appointments'),
]