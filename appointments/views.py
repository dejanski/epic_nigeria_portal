from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer
from patients.models import Patient
from accounts.models import User

@api_view(['POST'])
def book_appointment(request):
    # Patient or admin can book
    if request.user.role not in ['patient', 'admin']:
        return Response({'error': 'Only patients or admins can book appointments'}, status=403)

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        try:
            patient = Patient.objects.get(id=request.data['patient'])
            clinician = User.objects.get(id=request.data['clinician'], role='clinician')
        except (Patient.DoesNotExist, User.DoesNotExist):
            return Response({'error': 'Invalid patient or clinician'}, status=404)

        # If user is a patient, ensure they're booking for themselves
        if request.user.role == 'patient' and (not hasattr(request.user, 'patient') or request.user.patient.id != patient.id):
            return Response({'error': 'Patients can only book for themselves'}, status=403)

        appointment = serializer.save(
            patient=patient,
            clinician=clinician,
            clinic_id=request.data.get('clinic_id', 'DEFAULT')
        )
        return Response({
            'appointment_id': appointment.id,
            'status': 'success',
            'confirmation': 'Appointment booked'
        }, status=201)
    return Response(serializer.errors, status=400)