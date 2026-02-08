"""Account models — bank, MFS, credit card, cash."""
import uuid
from django.db import models


class Account(models.Model):
    TYPE_BANK = "bank"
    TYPE_MFS = "mfs"
    TYPE_CREDIT_CARD = "credit_card"
    TYPE_CASH = "cash"
    TYPE_CHOICES = [
        (TYPE_BANK, "Bank"),
        (TYPE_MFS, "Mobile Financial Service"),
        (TYPE_CREDIT_CARD, "Credit Card"),
        (TYPE_CASH, "Cash"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=100, blank=True)
    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    initial_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    currency_code = models.CharField(max_length=3, default="USD")
    # Credit card specific
    credit_limit = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    billing_date = models.IntegerField(null=True, blank=True)  # day of month (1-31)
    due_date = models.IntegerField(null=True, blank=True)  # payment due day (1-31)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "accounts"
        managed = False

    def __str__(self):
        return f"{self.name} ({self.type})"
