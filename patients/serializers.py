from rest_framework import serializers
from .models import Patient

class PatientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'date_of_birth', 'gender', 'contact_info', 'insurance_provider']