from rest_framework import serializers
from .models import Prescription, RefillRequest

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['patient', 'medication_name', 'dosage', 'frequency', 'duration']

class RefillRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefillRequest
        fields = ['id', 'prescription', 'requested_at', 'status', 'notes']
        read_only_fields = ['id', 'requested_at', 'status']