from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LabResult
from .serializers import LabResultSerializer
from drf_spectacular.utils import extend_schema
from datetime import datetime

@extend_schema(request=LabResultSerializer, responses={201: LabResultSerializer})
@api_view(['POST'])
def create_lab_order(request):
    # Set ordered_date automatically if not provided (though model might expect it)
    data = request.data.copy()
    if 'ordered_date' not in data:
        data['ordered_date'] = datetime.now()
        
    serializer = LabResultSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={200: LabResultSerializer(many=True)})
@api_view(['GET'])
def list_labs(request):
    # Filter by patient_id if provided
    patient_id = request.query_params.get('patient_id')
    if patient_id:
        labs = LabResult.objects.filter(patient_id=patient_id).order_by('-ordered_date')
    else:
        labs = LabResult.objects.all().order_by('-ordered_date')
        
    serializer = LabResultSerializer(labs, many=True)
    return Response(serializer.data)

@extend_schema(request=LabResultSerializer, responses={200: LabResultSerializer})
@api_view(['PATCH'])
def update_lab_result(request, lab_id):
    try:
        lab = LabResult.objects.get(id=lab_id)
    except LabResult.DoesNotExist:
        return Response({'error': 'Lab not found'}, status=404)

    serializer = LabResultSerializer(lab, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)