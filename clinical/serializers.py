from rest_framework import serializers
from .models import ClinicalNote

class ClinicalNoteSerializer(serializers.ModelSerializer):
    clinician_name = serializers.CharField(source='clinician.get_full_name', read_only=True)

    class Meta:
        model = ClinicalNote
        fields = ['id', 'patient', 'clinician_name', 'visit_date', 'notes', 'diagnosis']