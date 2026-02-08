"""Budget plan model — monthly category allocations."""
import uuid
from django.db import models


class BudgetPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField(db_index=True)
    category_id = models.UUIDField()
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
    planned_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "budget_plans"
        managed = False
        unique_together = [("user_id", "category_id", "month", "year")]

    def __str__(self):
        return f"Budget {self.year}-{self.month:02d} category={self.category_id}"
