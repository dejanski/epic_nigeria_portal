from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Patient

User = get_user_model()

class PatientTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register_patient')  # Ensure this URL name exists in your urls.py
        
        # Create users
        self.patient_user = User.objects.create_user(username='patient1', password='password', role='patient')
        self.admin_user = User.objects.create_user(username='admin1', password='password', role='admin')
        self.other_user = User.objects.create_user(username='other1', password='password', role='patient')

        # Create a patient profile linked to patient_user
        self.patient_profile = Patient.objects.create(
            user=self.patient_user,
            name="John Doe",
            date_of_birth="1990-01-01",
            gender="M",
            contact_info="1234567890",
            insurance_provider="NHIA"
        )
        self.update_url = reverse('update_patient_profile', args=[self.patient_profile.id])

    def test_register_patient(self):
        """Test registering a new patient"""
        data = {
            "name": "Jane Doe",
            "date_of_birth": "1995-05-05",
            "gender": "F",
            "contact_info": "0987654321",
            "insurance_provider": "HMO"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Patient.objects.count(), 2)

    def test_patient_update_own_profile(self):
        """Test patient updating their own profile"""
        self.client.force_authenticate(user=self.patient_user)
        data = {"contact_info": "1111111111"}
        response = self.client.patch(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.patient_profile.refresh_from_db()
        self.assertEqual(self.patient_profile.contact_info, "1111111111")

    def test_patient_update_other_profile(self):
        """Test patient trying to update someone else's profile"""
        self.client.force_authenticate(user=self.other_user)
        data = {"contact_info": "2222222222"}
        response = self.client.patch(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_patient_profile(self):
        """Test admin updating a patient profile"""
        self.client.force_authenticate(user=self.admin_user)
        data = {"contact_info": "3333333333"}
        response = self.client.patch(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.patient_profile.refresh_from_db()
        self.assertEqual(self.patient_profile.contact_info, "3333333333")
