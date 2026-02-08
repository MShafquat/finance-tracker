"""Category model — income/expense categories per user."""
import uuid
from django.db import models


class Category(models.Model):
    TYPE_INCOME = "income"
    TYPE_EXPENSE = "expense"
    TYPE_CHOICES = [
        (TYPE_INCOME, "Income"),
        (TYPE_EXPENSE, "Expense"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, blank=True)  # hex color
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "categories"
        managed = False
        verbose_name_plural = "categories"

    def __str__(self):
        return f"{self.name} ({self.type})"
