"""Budget plan serializers."""
from rest_framework import serializers
from .models import BudgetPlan


class BudgetPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetPlan
        fields = [
            "id",
            "category_id",
            "month",
            "year",
            "planned_amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError("Month must be between 1 and 12.")
        return value


class BudgetProgressSerializer(serializers.Serializer):
    category_id = serializers.UUIDField()
    category_name = serializers.CharField()
    planned_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    actual_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    remaining = serializers.DecimalField(max_digits=15, decimal_places=2)
    percentage_used = serializers.FloatField()
