from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserManagerTests(TestCase):
    def test_create_user(self):
        """Test creating a standard user"""
        user = User.objects.create_user(username='testuser', password='password123', role='patient')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('password123'))
        self.assertEqual(user.role, 'patient')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """Test creating a superuser"""
        admin_user = User.objects.create_superuser(username='admin', password='password123', role='admin')
        self.assertEqual(admin_user.username, 'admin')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertEqual(admin_user.role, 'admin')

    def test_create_user_with_hospital(self):
        """Test creating a user linked to a hospital"""
        from hospitals.models import Hospital
        hospital = Hospital.objects.create(name="Test Hospital", address="123 St", contact_info="000")
        user = User.objects.create_user(username='doc1', password='password', role='clinician', hospital=hospital)
        self.assertEqual(user.hospital, hospital)
