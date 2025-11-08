from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import LabResult

@api_view(['GET'])
def get_lab_results(request, patient_id):
    # Clinician, admin, or patient (for self)
    if request.user.role == 'patient':
        if not hasattr(request.user, 'patient') or request.user.patient.id != patient_id:
            return Response({'error': 'Access denied'}, status=403)
    elif request.user.role not in ['clinician', 'admin']:
        return Response({'error': 'Unauthorized'}, status=403)

    results = LabResult.objects.filter(patient_id=patient_id)
    data = [{
        'test_type': r.test_type,
        'result_value': r.result_value,
        'unit': r.unit,
        'status': r.status,
        'ordered_date': r.ordered_date.isoformat(),
    } for r in results]
    return Response(data)