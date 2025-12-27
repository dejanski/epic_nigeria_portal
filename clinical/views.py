from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ClinicalNoteSerializer

@api_view(['POST'])
def document_clinical_note(request):
    if request.user.role != 'clinician':
        return Response({'error': 'Only clinicians can document notes'}, status=status.HTTP_403_FORBIDDEN)
    serializer = ClinicalNoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(clinician=request.user)
        return Response({
            'documentation_id': serializer.instance.id,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)