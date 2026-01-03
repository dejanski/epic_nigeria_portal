# patients/models.py
from django.db import models
from accounts.models import User

class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    contact_info = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    insurance_provider = models.CharField(max_length=100)
    nhia_id = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name