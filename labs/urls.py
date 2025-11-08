from django.urls import path
from . import views

urlpatterns = [
    path('patients/<int:patient_id>/results/', views.get_lab_results, name='lab_results'),
]