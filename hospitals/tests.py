from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Hospital

User = get_user_model()

class HospitalAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username='admin', password='password', role='admin')
        self.clinician_user = User.objects.create_user(username='clinician', password='password', role='clinician')
        self.create_url = reverse('create_hospital')

    def test_create_hospital_admin(self):
        """Test admin can create hospital"""
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name": "New Hospital",
            "address": "456 Test Ave",
            "contact_info": "09000000000"
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Hospital.objects.count(), 1)

    def test_create_hospital_non_admin(self):
        """Test non-admin cannot create hospital"""
        self.client.force_authenticate(user=self.clinician_user)
        data = {
            "name": "Unauthorized Hospital",
            "address": "789 Fake St",
            "contact_info": "0000000000"
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Hospital.objects.count(), 0)

    def test_delete_hospital_admin(self):
        """Test admin can delete hospital"""
        hospital = Hospital.objects.create(name="Delete Me", address="...", contact_info="...")
        delete_url = reverse('delete_hospital', args=[hospital.id])
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Hospital.objects.count(), 0)

    def test_delete_hospital_non_admin(self):
        """Test non-admin cannot delete hospital"""
        hospital = Hospital.objects.create(name="Keep Me", address="...", contact_info="...")
        delete_url = reverse('delete_hospital', args=[hospital.id])
        
        self.client.force_authenticate(user=self.clinician_user)
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Hospital.objects.count(), 1)
