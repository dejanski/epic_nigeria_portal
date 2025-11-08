from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ClaimSerializer

@api_view(['POST'])
def submit_claim(request):
    if request.user.role not in ['billing_staff', 'admin']:
        return Response({'error': 'Only billing staff can submit claims'}, status=status.HTTP_403_FORBIDDEN)
    serializer = ClaimSerializer(data=request.data)
    if serializer.is_valid():
        claim = serializer.save()
        return Response({
            'claim_id': claim.id,
            'processing_status': claim.status
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

