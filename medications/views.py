from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PrescriptionSerializer

@api_view(['POST'])
def prescribe_medication(request):
    if request.user.role not in ['clinician', 'admin']:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    serializer = PrescriptionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'prescription_id': serializer.instance.id,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import RefillRequest

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