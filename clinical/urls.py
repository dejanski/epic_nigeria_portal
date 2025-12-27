from django.urls import path
from . import views

urlpatterns = [
    path('document/', views.document_clinical_note, name='document_clinical_note'),
]