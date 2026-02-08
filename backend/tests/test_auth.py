"""Tests for Supabase JWT authentication."""
import uuid
import time
from unittest.mock import patch
import jwt
from django.test import TestCase, override_settings
from rest_framework.test import APIClient


FAKE_SECRET = "test-secret-key-32-chars-minimum-here"


def make_token(sub=None, email="test@example.com", expired=False, audience="authenticated"):
    sub = sub or str(uuid.uuid4())
    now = int(time.time())
    payload = {
        "sub": sub,
        "email": email,
        "role": "authenticated",
        "aud": audience,
        "iat": now,
        "exp": now + (3600 if not expired else -1),
    }
    return jwt.encode(payload, FAKE_SECRET, algorithm="HS256"), sub


@override_settings(SUPABASE_JWT_SECRET=FAKE_SECRET)
class SupabaseJWTAuthTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_valid_token_authenticates(self):
        token, user_id = make_token()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        # Health check is AllowAny but we can check auth on a protected endpoint
        with patch("apps.users.views.Profile.objects.get") as mock_get:
            mock_get.return_value = type("Profile", (), {
                "id": user_id, "email": "test@example.com",
                "full_name": "", "avatar_url": "", "currency_code": "USD",
                "onboarding_completed": False, "monthly_income": None,
                "income_category": "salary", "created_at": None, "updated_at": None,
            })()
            response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 200)

    def test_missing_token_returns_401(self):
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 401)

    def test_expired_token_returns_401(self):
        token, _ = make_token(expired=True)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 401)
        self.assertIn("expired", response.data["detail"].lower())

    def test_invalid_token_returns_401(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer not.a.valid.token")
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 401)

    def test_wrong_audience_returns_401(self):
        token, _ = make_token(audience="wrong-audience")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 401)

    def test_health_check_no_auth_required(self):
        response = self.client.get("/api/v1/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "ok")
