"""Tests for Account endpoints and serializers."""
import uuid
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.accounts.serializers import AccountSerializer
from tests.test_auth import make_token, FAKE_SECRET


class AccountSerializerTest(TestCase):
    def _base_data(self, **overrides):
        data = {
            "name": "My Bank",
            "type": "bank",
            "provider": "Test Bank",
            "initial_balance": "5000.00",
        }
        data.update(overrides)
        return data

    def test_valid_bank_account(self):
        serializer = AccountSerializer(data=self._base_data())
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_valid_mfs_account(self):
        serializer = AccountSerializer(data=self._base_data(type="mfs", name="bKash"))
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_valid_cash_account(self):
        serializer = AccountSerializer(data=self._base_data(type="cash", name="Wallet"))
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_credit_card_requires_credit_limit(self):
        serializer = AccountSerializer(
            data=self._base_data(type="credit_card", name="My Card")
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("credit_limit", serializer.errors)

    def test_credit_card_requires_billing_date(self):
        serializer = AccountSerializer(
            data=self._base_data(
                type="credit_card",
                name="My Card",
                credit_limit="50000.00",
                # Missing billing_date
            )
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("billing_date", serializer.errors)

    def test_valid_credit_card(self):
        serializer = AccountSerializer(
            data=self._base_data(
                type="credit_card",
                name="My Card",
                credit_limit="50000.00",
                billing_date=15,
                due_date=5,
            )
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)


@override_settings(SUPABASE_JWT_SECRET=FAKE_SECRET)
class AccountEndpointAuthTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_accounts_requires_auth(self):
        response = self.client.get("/api/v1/accounts/")
        self.assertEqual(response.status_code, 401)

    def test_consolidated_balance_requires_auth(self):
        response = self.client.get("/api/v1/accounts/consolidated_balance/")
        self.assertEqual(response.status_code, 401)
