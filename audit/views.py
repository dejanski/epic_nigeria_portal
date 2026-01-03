from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AuditLog
from .serializers import AuditLogSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(responses={200: AuditLogSerializer(many=True)})
@api_view(['GET'])
def list_audit_logs(request):
    # Only Admin/Superuser
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Unauthorized'}, status=403)
        
    logs = AuditLog.objects.all().order_by('-timestamp')[:100] # Limit to last 100 for perf
    serializer = AuditLogSerializer(logs, many=True)
    return Response(serializer.data)