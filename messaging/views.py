from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
from accounts.models import User

@api_view(['POST'])
def send_message(request):
    if request.user.role not in ['patient', 'clinician', 'admin']:
        return Response({'error': 'Unauthorized'}, status=403)

    recipient_id = request.data.get('recipient_id')
    try:
        recipient = User.objects.get(id=recipient_id)
    except User.DoesNotExist:
        return Response({'error': 'Recipient not found'}, status=404)

    # Optional: restrict patient → clinician/admin only
    if request.user.role == 'patient' and recipient.role not in ['clinician', 'admin']:
        return Response({'error': 'Patients can only message clinicians or admins'}, status=403)

    message = Message.objects.create(
        sender=request.user,
        recipient=recipient,
        subject=request.data.get('subject', ''),
        body=request.data.get('body', '')
    )
    return Response({'message_id': message.id, 'status': 'sent'}, status=201)