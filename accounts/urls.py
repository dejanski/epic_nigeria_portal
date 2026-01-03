from django.urls import path
from . import views

urlpatterns = [
    path('staff/list/', views.list_staff, name='list_staff'),
    path('staff/create/', views.create_staff, name='create_staff'),
    path('me/', views.current_user, name='current_user'),
    path('change-password/', views.change_password, name='change_password'),
]