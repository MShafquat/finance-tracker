"""Tests for Transaction serializer validation."""
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from apps.transactions.serializers import TransactionSerializer


class TransactionSerializerTest(TestCase):
    def _valid_data(self, **overrides):
        data = {
            "account_id": "550e8400-e29b-41d4-a716-446655440000",
            "type": "expense",
            "amount": "100.00",
            "transaction_date": "2026-02-08",
            "description": "Test transaction",
        }
        data.update(overrides)
        return data

    def test_valid_expense(self):
        serializer = TransactionSerializer(data=self._valid_data())
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_negative_amount_rejected(self):
        serializer = TransactionSerializer(data=self._valid_data(amount="-50"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_zero_amount_rejected(self):
        serializer = TransactionSerializer(data=self._valid_data(amount="0"))
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_transfer_requires_destination_account(self):
        serializer = TransactionSerializer(
            data=self._valid_data(type="transfer", amount="200")
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("transfer_to_account_id", serializer.errors)

    def test_transfer_with_destination_is_valid(self):
        serializer = TransactionSerializer(
            data=self._valid_data(
                type="transfer",
                amount="200",
                transfer_to_account_id="660e8400-e29b-41d4-a716-446655440001",
            )
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
