from django.db import models
from patients.models import Patient

class LabResult(models.Model):
    TEST_CHOICES = [
        ('HbA1c', 'HbA1c'),
        ('CBC', 'Complete Blood Count'),
        ('Malaria', 'Malaria Test'),
        ('HIV', 'HIV Test'),
        ('Ultrasound', 'Ultrasound'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=50, choices=TEST_CHOICES)
    result_value = models.CharField(max_length=100)
    unit = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ])
    ordered_date = models.DateTimeField()
    completed_date = models.DateTimeField(null=True, blank=True)