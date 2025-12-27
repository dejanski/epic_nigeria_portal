from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'user_id', 'username', 'action', 'ip_address', 'timestamp', 'details']
