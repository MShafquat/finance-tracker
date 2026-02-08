"""Transaction serializers."""
from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "account_id",
            "category_id",
            "type",
            "amount",
            "description",
            "notes",
            "transaction_date",
            "transfer_to_account_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        tx_type = data.get("type", getattr(self.instance, "type", None))
        if tx_type == Transaction.TYPE_TRANSFER:
            if not data.get("transfer_to_account_id") and not getattr(
                self.instance, "transfer_to_account_id", None
            ):
                raise serializers.ValidationError(
                    {
                        "transfer_to_account_id": (
                            "Destination account required for transfers."
                        )
                    }
                )
        if data.get("amount", 0) <= 0:
            raise serializers.ValidationError({"amount": "Amount must be positive."})
        return data


class TransactionSummarySerializer(serializers.Serializer):
    category_id = serializers.UUIDField()
    category_name = serializers.CharField()
    total = serializers.DecimalField(max_digits=15, decimal_places=2)
    count = serializers.IntegerField()
