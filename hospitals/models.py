from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_info = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
