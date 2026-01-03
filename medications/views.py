from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PrescriptionSerializer, RefillRequestSerializer
from drf_spectacular.utils import extend_schema
from .models import Prescription, RefillRequest

@extend_schema(request=PrescriptionSerializer, responses={201: dict})
@api_view(['POST'])
def prescribe_medication(request):
    if not request.user.is_superuser and request.user.role not in ['clinician', 'admin', 'nurse']:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    serializer = PrescriptionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'prescription_id': serializer.instance.id,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(request=None, responses={201: dict})
@api_view(['POST'])
def request_refill(request, prescription_id):
    if request.user.role != 'patient':
        return Response({'error': 'Only patients can request refills'}, status=403)

    try:
        prescription = Prescription.objects.get(id=prescription_id, patient__user=request.user)
    except Prescription.DoesNotExist:
        return Response({'error': 'Prescription not found or not yours'}, status=404)

    refill, created = RefillRequest.objects.get_or_create(
        prescription=prescription,
        status='pending'
    )
    return Response({
        'refill_id': refill.id,
        'status': 'Refill request submitted'
    }, status=201)

@extend_schema(responses={200: PrescriptionSerializer(many=True)})
@api_view(['GET'])
def list_prescriptions(request):
    patient_id = request.query_params.get('patient_id')
    if patient_id:
        prescriptions = Prescription.objects.filter(patient_id=patient_id)
    else:
        prescriptions = Prescription.objects.all()
    serializer = PrescriptionSerializer(prescriptions, many=True)
    return Response(serializer.data)