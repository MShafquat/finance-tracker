"""Account serializers."""
from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "name",
            "type",
            "provider",
            "current_balance",
            "initial_balance",
            "currency_code",
            "credit_limit",
            "billing_date",
            "due_date",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "current_balance", "created_at", "updated_at"]

    def validate(self, data):
        account_type = data.get("type", getattr(self.instance, "type", None))
        if account_type == Account.TYPE_CREDIT_CARD:
            if not data.get("credit_limit") and not getattr(
                self.instance, "credit_limit", None
            ):
                raise serializers.ValidationError(
                    {"credit_limit": "Credit limit is required for credit card accounts."}
                )
            if not data.get("billing_date") and not getattr(
                self.instance, "billing_date", None
            ):
                raise serializers.ValidationError(
                    {"billing_date": "Billing date is required for credit card accounts."}
                )
        return data
