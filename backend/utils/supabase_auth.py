"""Supabase JWT authentication for Django REST Framework.

Supports both HS256 (legacy) and ES256 (current Supabase) signed tokens.
ES256 tokens are verified via Supabase's JWKS endpoint.
"""
import ssl
import certifi
import jwt
from jwt import PyJWKClient
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


# Cache the JWKS client per project URL
_jwks_clients: dict = {}


def _get_jwks_client(supabase_url: str) -> PyJWKClient:
    if supabase_url not in _jwks_clients:
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        _jwks_clients[supabase_url] = PyJWKClient(
            f"{supabase_url}/auth/v1/.well-known/jwks.json",
            ssl_context=ssl_context,
        )
    return _jwks_clients[supabase_url]


class SupabaseUser:
    """Lightweight user object constructed from Supabase JWT claims."""

    def __init__(self, payload: dict):
        self.id = payload["sub"]  # Supabase user UUID
        self.email = payload.get("email", "")
        self.role = payload.get("role", "authenticated")
        self.is_authenticated = True
        self.is_active = True
        self.pk = self.id

    def __str__(self):
        return f"SupabaseUser({self.email})"


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Authenticates requests using Supabase-issued JWTs.

    Supports both:
    - HS256: verified with SUPABASE_JWT_SECRET
    - ES256: verified with public key from SUPABASE_URL JWKS endpoint

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
            header = jwt.get_unverified_header(token)
            alg = header.get("alg", "HS256")

            if alg == "HS256":
                payload = jwt.decode(
                    token,
                    settings.SUPABASE_JWT_SECRET,
                    algorithms=["HS256"],
                    audience="authenticated",
                )
            elif alg == "ES256":
                supabase_url = settings.SUPABASE_URL
                jwks_client = _get_jwks_client(supabase_url)
                signing_key = jwks_client.get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=["ES256"],
                    audience="authenticated",
                )
            else:
                raise AuthenticationFailed(f"Unsupported JWT algorithm: {alg}")

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
