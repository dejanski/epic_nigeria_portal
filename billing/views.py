from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Claim
from .serializers import ClaimSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(request=ClaimSerializer, responses={201: ClaimSerializer})
@api_view(['POST'])
def create_claim(request):
    serializer = ClaimSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={200: ClaimSerializer(many=True)})
@api_view(['GET'])
def list_claims(request):
    claims = Claim.objects.all().order_by('-submitted_at')
    
    # Optional filtering
    status_filter = request.GET.get('status')
    if status_filter:
        claims = claims.filter(status=status_filter)
        
    patient_id = request.GET.get('patient_id')
    if patient_id:
        claims = claims.filter(patient_id=patient_id)

    serializer = ClaimSerializer(claims, many=True)
    return Response(serializer.data)

@extend_schema(request=ClaimSerializer, responses={200: ClaimSerializer})
@api_view(['PATCH'])
def update_claim_status(request, claim_id):
    try:
        claim = Claim.objects.get(id=claim_id)
    except Claim.DoesNotExist:
        return Response({'error': 'Claim not found'}, status=404)

    # Simple RBAC: Only billing staff or admin/superuser can approve/reject
    if not request.user.is_superuser and request.user.role not in ['admin', 'billing_staff']:
         return Response({'error': 'Unauthorized'}, status=403)

    serializer = ClaimSerializer(claim, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
