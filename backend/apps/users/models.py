"""User profile model — mirrors Supabase public.profiles table."""
import uuid
from django.db import models


class Profile(models.Model):
    """
    User profile synced from Supabase auth.users.
    Primary key is the Supabase auth UUID.
    Django does not own migrations — Supabase does.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200, blank=True)
    avatar_url = models.URLField(blank=True)
    currency_code = models.CharField(max_length=3, default="USD")
    onboarding_completed = models.BooleanField(default=False)
    monthly_income = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    income_category = models.CharField(max_length=50, default="salary")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "profiles"
        managed = False

    def __str__(self):
        return self.email
