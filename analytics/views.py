from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum
from patients.models import Patient
from clinical.models import ClinicalNote
from billing.models import Claim
from django.db import connection
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

@extend_schema(responses={200: OpenApiTypes.OBJECT})
@api_view(['GET'])
def analytics_summary(request):
    clinic_id = request.GET.get('clinic_id')
    date_range = request.GET.get('date_range')  # expect "YYYY-MM-DD,YYYY-MM-DD"
    metric_type = request.GET.get('metric_type', 'all')

    # Placeholder logic – expand as needed
    data = {}
    if metric_type in ['all', 'patients']:
        data['total_patients'] = Patient.objects.count()
    if metric_type in ['all', 'visits']:
        data['total_visits'] = ClinicalNote.objects.count()
    if metric_type in ['all', 'claims']:
        total_cost = Claim.objects.aggregate(total=Sum('cost'))['total'] or 0
        data['total_claims_value'] = float(total_cost)

    return Response(data)



@extend_schema(responses={200: OpenApiTypes.OBJECT})
@api_view(['GET'])
def system_status(request):
    # Check DB
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_ok = True
    except:
        db_ok = False

    return Response({
        'status': 'operational' if db_ok else 'degraded',
        'components': {
            'database': 'ok' if db_ok else 'error',
            'oauth2': 'ok',  # assumed
        },
        'uptime': '99.8%',  # placeholder; use external monitoring in prod
        'region': 'Nigeria (West Africa)'
    })