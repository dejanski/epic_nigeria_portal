from rest_framework import serializers
from .models import ClinicalNote

class ClinicalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalNote
        fields = ['patient', 'visit_date', 'notes', 'diagnosis']