from rest_framework import serializers
from .models import LabResult

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = ['id', 'test_type', 'result_value', 'unit', 'status', 'ordered_date', 'completed_date']
