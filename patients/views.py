from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import PatientRegistrationSerializer
from .models import Patient
from drf_spectacular.utils import extend_schema

@extend_schema(request=PatientRegistrationSerializer, responses={201: dict})
@api_view(['POST'])
def register_patient(request):
    serializer = PatientRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        patient = serializer.save()
        return Response({
            'patient_id': patient.id,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(request=PatientRegistrationSerializer, responses={200: dict})
@api_view(['PATCH'])
def update_patient_profile(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)

    # RBAC: patient can edit self; admin can edit anyone
    if request.user.role == 'patient':
        if not hasattr(request.user, 'patient') or request.user.patient.id != patient.id:
            return Response({'error': 'You can only update your own profile'}, status=403)
    elif request.user.role not in ['admin', 'billing_staff']:
        return Response({'error': 'Unauthorized'}, status=403)

    serializer = PatientRegistrationSerializer(patient, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'Profile updated'}, status=200)
    return Response(serializer.errors, status=400)