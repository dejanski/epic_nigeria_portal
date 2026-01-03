from django.urls import path
from . import views

urlpatterns = [
    path('claims/create/', views.create_claim, name='create_claim'),
    path('claims/list/', views.list_claims, name='list_claims'),
    path('claims/<int:claim_id>/update/', views.update_claim_status, name='update_claim_status'),
]