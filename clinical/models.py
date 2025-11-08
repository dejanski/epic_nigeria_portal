# clinical/models.py
from django.db import models
from patients.models import Patient
from accounts.models import User

class ClinicalNote(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    clinician = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'clinician'})
    visit_date = models.DateTimeField()
    notes = models.TextField()
    diagnosis = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.patient.name} - {self.visit_date}"