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

    def test_create_user_with_clinic_id(self):
        """Test creating a user with a specific clinic ID"""
        user = User.objects.create_user(username='doc1', password='password', role='clinician', clinic_id='LAG001')
        self.assertEqual(user.clinic_id, 'LAG001')
