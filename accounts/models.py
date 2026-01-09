# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

from hospitals.models import Hospital

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('clinician', 'Clinician'),
        ('nurse', 'Nurse'),
        ('lab_tech', 'Lab Technician'),
        ('billing_staff', 'Billing Staff'),
        ('patient', 'Patient'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, blank=True)