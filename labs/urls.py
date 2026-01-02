from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_lab_order, name='create_lab_order'),
    path('list/', views.list_labs, name='list_labs'),
    path('<int:lab_id>/update/', views.update_lab_result, name='update_lab_result'),
]