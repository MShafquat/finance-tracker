"""Transaction model — income, expense, transfer records."""
import uuid
from django.db import models


class Transaction(models.Model):
    TYPE_INCOME = "income"
    TYPE_EXPENSE = "expense"
    TYPE_TRANSFER = "transfer"
    TYPE_CHOICES = [
        (TYPE_INCOME, "Income"),
        (TYPE_EXPENSE, "Expense"),
        (TYPE_TRANSFER, "Transfer"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField(db_index=True)
    account_id = models.UUIDField(db_index=True)
    category_id = models.UUIDField(null=True, blank=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    transaction_date = models.DateField()
    transfer_to_account_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "transactions"
        managed = False
        ordering = ["-transaction_date", "-created_at"]

    def __str__(self):
        return f"{self.type} {self.amount} on {self.transaction_date}"
