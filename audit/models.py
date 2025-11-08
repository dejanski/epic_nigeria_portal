from django.db import models

class AuditLog(models.Model):
    user_id = models.IntegerField()
    username = models.CharField(max_length=150)
    action = models.CharField(max_length=100)  # e.g., 'patient_view', 'claim_submit'
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)