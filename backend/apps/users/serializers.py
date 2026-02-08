"""User profile serializers."""
from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "email",
            "full_name",
            "avatar_url",
            "currency_code",
            "onboarding_completed",
            "monthly_income",
            "income_category",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "full_name",
            "avatar_url",
            "currency_code",
            "monthly_income",
            "income_category",
            "onboarding_completed",
        ]
