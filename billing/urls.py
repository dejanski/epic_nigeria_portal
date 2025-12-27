from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_claim, name='submit_claim'),
]