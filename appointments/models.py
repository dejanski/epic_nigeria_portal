from django.db import models
from patients.models import Patient
from accounts.models import User

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'clinician'})
    clinic_id = models.CharField(max_length=50)
    appointment_datetime = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='scheduled', choices=[
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no-show', 'No-Show')
    ])
    created_at = models.DateTimeField(auto_now_add=True)