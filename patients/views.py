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

@extend_schema(request=PatientRegistrationSerializer, responses={200: PatientRegistrationSerializer})
@api_view(['GET', 'PATCH'])
def update_patient_profile(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)

    # RBAC: patient can edit self; admin can edit anyone
    if request.user.role == 'patient':
        if not hasattr(request.user, 'patient') or request.user.patient.id != patient.id:
            return Response({'error': 'You can only update your own profile'}, status=403)
    elif not request.user.is_superuser and request.user.role not in ['admin', 'billing_staff', 'clinician']:
        return Response({'error': 'Unauthorized'}, status=403)

    if request.method == 'GET':
        serializer = PatientRegistrationSerializer(patient)
        return Response(serializer.data)

    serializer = PatientRegistrationSerializer(patient, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'Profile updated'}, status=200)
    return Response(serializer.errors, status=400)

@extend_schema(responses={200: PatientRegistrationSerializer(many=True)})
@api_view(['GET'])
def list_patients(request):
    # RBAC: only staff/admin
    if not request.user.is_superuser and request.user.role not in ['admin', 'clinician', 'billing_staff']:
         return Response({'error': 'Unauthorized'}, status=403)
         
    queryset = Patient.objects.all().order_by('-id')
    
    search_query = request.GET.get('search', None)
    if search_query:
        from django.db.models import Q
        if search_query.isdigit():
            queryset = queryset.filter(id=search_query)
        else:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(contact_info__icontains=search_query) |
                Q(insurance_provider__icontains=search_query)
            )

    # Manual Pagination
    from rest_framework.pagination import PageNumberPagination
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = PatientRegistrationSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)