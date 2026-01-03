from accounts.permissions import IsClinician
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import ClinicalNoteSerializer
from drf_spectacular.utils import extend_schema


@extend_schema(request=ClinicalNoteSerializer, responses={201: dict})
@api_view(['POST'])
@permission_classes([IsClinician])
def document_clinical_note(request):

    serializer = ClinicalNoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(clinician=request.user)
        return Response({
            'documentation_id': serializer.instance.id,
            'status': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(responses={200: ClinicalNoteSerializer(many=True)})
@api_view(['GET'])
def list_clinical_notes(request):
    from .models import ClinicalNote
    patient_id = request.query_params.get('patient_id')
    if patient_id:
        notes = ClinicalNote.objects.filter(patient_id=patient_id).order_by('-visit_date')
    else:
        # Check if user is allowed to see all notes, otherwise restrict?
        # For now, if superuser/admin/clinician, show all (paginated by default in future)
        notes = ClinicalNote.objects.all().order_by('-visit_date')
    
    serializer = ClinicalNoteSerializer(notes, many=True)
    return Response(serializer.data)