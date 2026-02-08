"""Saving plan model."""
import uuid
from django.db import models


class SavingPlan(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_COMPLETED = "completed"
    STATUS_PAUSED = "paused"
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_PAUSED, "Paused"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=15, decimal_places=2)
    current_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    target_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    suggestion_rule = models.CharField(max_length=50, blank=True)
    monthly_contribution = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "saving_plans"
        managed = False

    def __str__(self):
        return f"{self.name} ({self.status})"
