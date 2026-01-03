from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(request=AppointmentSerializer, responses={201: AppointmentSerializer})
@api_view(['POST'])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={200: AppointmentSerializer(many=True)})
@api_view(['GET'])
def list_appointments(request):
    patient_id = request.query_params.get('patient_id')
    if patient_id:
        appointments = Appointment.objects.filter(patient_id=patient_id).order_by('-appointment_datetime')
    else:
        appointments = Appointment.objects.all().order_by('-appointment_datetime')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@extend_schema(request=AppointmentSerializer, responses={200: AppointmentSerializer})
@api_view(['PUT', 'PATCH'])
def update_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)