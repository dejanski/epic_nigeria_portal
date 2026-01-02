from rest_framework import serializers
from .models import LabResult

class LabResultSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = LabResult
        fields = '__all__'
