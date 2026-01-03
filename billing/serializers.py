from rest_framework import serializers
from .models import Claim

class ClaimSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Claim
        fields = '__all__'