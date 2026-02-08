"""User profile views."""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .models import Profile
from .serializers import ProfileSerializer, ProfileUpdateSerializer


class ProfileViewSet(viewsets.GenericViewSet):
    """Profile endpoints — create via sync, read/update current user."""

    serializer_class = ProfileSerializer

    def me(self, request):
        """GET /auth/me/ — return authenticated user's profile."""
        try:
            profile = Profile.objects.get(id=request.user.id)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProfileSerializer(profile).data)


class AuthSyncView(APIView):
    """
    POST /auth/sync/
    Called after first login to ensure a profile row exists in the DB.
    Supabase trigger handles this for new users, but this is a safety net.
    """

    def post(self, request):
        user = request.user
        profile, created = Profile.objects.get_or_create(
            id=user.id,
            defaults={
                "email": user.email,
                "full_name": request.data.get("full_name", ""),
                "avatar_url": request.data.get("avatar_url", ""),
            },
        )
        serializer = ProfileSerializer(profile)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)


class OnboardingView(APIView):
    """
    POST /onboarding/complete/
    Saves monthly income and marks onboarding as done.
    """

    def post(self, request):
        try:
            profile = Profile.objects.get(id=request.user.id)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(onboarding_completed=True)
            return Response(ProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
