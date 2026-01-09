from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Hospital
from .serializers import HospitalSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(request=HospitalSerializer, responses={201: HospitalSerializer})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_hospital(request):
    # RBAC: Admin only
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Unauthorized. Only Admins can create hospitals.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = HospitalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={204: None})
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_hospital(request, hospital_id):
    # RBAC: Admin only
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Unauthorized. Only Admins can delete hospitals.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        hospital = Hospital.objects.get(id=hospital_id)
        hospital.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)
