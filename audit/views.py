from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AuditLog
from .serializers import AuditLogSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(responses=AuditLogSerializer(many=True))
@api_view(['GET'])
def get_audit_logs(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access only'}, status=403)

    logs = AuditLog.objects.all().order_by('-timestamp')[:100]
    data = [{
        'user': log.username,
        'action': log.action,
        'ip': log.ip_address,
        'time': log.timestamp.isoformat(),
        'details': log.details,
    } for log in logs]
    return Response(data)