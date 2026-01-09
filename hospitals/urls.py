from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_hospital, name='create_hospital'),
    path('<int:hospital_id>/delete/', views.delete_hospital, name='delete_hospital'),
]
