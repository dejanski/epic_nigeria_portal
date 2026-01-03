from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from clinical.models import ClinicalNote

class ClinicalNotePermissionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.clinician = User.objects.create_user(username='clinician', password='pass', role='clinician')
        self.admin = User.objects.create_user(username='admin', password='pass', role='admin')
        self.nurse = User.objects.create_user(username='nurse', password='pass', role='nurse')
        self.url = reverse('document_clinical_note') 

    def test_clinician_can_create_note(self):
        self.client.force_authenticate(user=self.clinician)
        data = {'content': 'Patient looks stable.', 'visit_date': '2023-10-27'}
        # Assuming minimal fields for now. 
        # If model expects more, we might get 400, which is fine for PERMISSION testing (as long as it's not 403)
        response = self.client.post(self.url, data)
        self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_cannot_create_note(self):
        self.client.force_authenticate(user=self.admin)
        data = {'content': 'Admin trying to practice medicine.', 'visit_date': '2023-10-27'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_nurse_cannot_create_note(self):
        self.client.force_authenticate(user=self.nurse)
        data = {'content': 'Nurse note.', 'visit_date': '2023-10-27'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
