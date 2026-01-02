from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_patient, name='register_patient'),
    path('list/', views.list_patients, name='list_patients'),
    path('<int:patient_id>/update/', views.update_patient_profile, name='update_patient_profile'),
]