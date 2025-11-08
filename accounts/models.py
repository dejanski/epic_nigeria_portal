# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('clinician', 'Clinician'),
        ('billing_staff', 'Billing Staff'),
        ('patient', 'Patient'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    clinic_id = models.CharField(max_length=50, blank=True, null=True)  # e.g., "LAG001"