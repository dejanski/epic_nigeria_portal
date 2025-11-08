# billing/models.py
from django.db import models
from patients.models import Patient

class Claim(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    services_rendered = models.JSONField()  # e.g., [{"service": "Consultation", "cost": 5000}]
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    insurance_details = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim {self.id} - {self.patient.name}"