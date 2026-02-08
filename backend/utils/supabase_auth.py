"""Supabase JWT authentication for Django REST Framework."""
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SupabaseUser:
    """Lightweight user object constructed from Supabase JWT claims."""

    def __init__(self, payload: dict):
        self.id = payload["sub"]  # Supabase user UUID
        self.email = payload.get("email", "")
        self.role = payload.get("role", "authenticated")
        self.is_authenticated = True
        self.is_active = True
        self.pk = self.id  # Convenience alias

    def __str__(self):
        return f"SupabaseUser({self.email})"


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Authenticates requests using Supabase-issued JWTs.

    Supabase signs tokens with HS256 using the JWT secret found in:
    Supabase Dashboard > Settings > API > JWT Settings > JWT Secret

    Clients must send:
        Authorization: Bearer <supabase_access_token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return None

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidAudienceError:
            raise AuthenticationFailed("Invalid token audience.")
        except jwt.InvalidTokenError as exc:
            raise AuthenticationFailed(f"Invalid token: {exc}")

        user = SupabaseUser(payload)
        return (user, token)

    def authenticate_header(self, request):
        return "Bearer"
