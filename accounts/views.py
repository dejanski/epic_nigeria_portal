from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model, update_session_auth_hash
from .serializers import UserSerializer, UserCreateSerializer, ChangePasswordSerializer
from .permissions import IsSuperUser
from drf_spectacular.utils import extend_schema

User = get_user_model()

@extend_schema(responses={200: UserSerializer(many=True)})
@api_view(['GET'])
@permission_classes([IsSuperUser])
def list_staff(request):
    # List all users who are not patients
    staff = User.objects.exclude(role='patient').order_by('-date_joined')
    
    from rest_framework.pagination import PageNumberPagination
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(staff, request)
    serializer = UserSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@extend_schema(request=UserCreateSerializer, responses={201: UserSerializer})
@api_view(['POST'])
@permission_classes([IsSuperUser])
def create_staff(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        read_serializer = UserSerializer(user)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    if serializer.is_valid():
        user = serializer.save()
        read_serializer = UserSerializer(user)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={200: UserSerializer})
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        data = serializer.data
        data['is_superuser'] = request.user.is_superuser
        return Response(data)
    
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(request=ChangePasswordSerializer, responses={200: dict})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if user.check_password(serializer.data.get('old_password')):
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)  # To keep user logged in
            return Response({'status': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
