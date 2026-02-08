"""Tests for saving rules engine."""
from decimal import Decimal
from django.test import TestCase

from apps.savings.rules import SavingRuleEngine


class SavingRuleEngineTest(TestCase):
    def test_50_30_20_rule(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("5000"),
            monthly_expenses=Decimal("3000"),
        )
        suggestions = {s["rule"]: s for s in result["suggestions"]}

        rule = suggestions["50_30_20"]
        self.assertEqual(rule["suggested_monthly_amount"], 1000.0)  # 20% of 5000
        self.assertTrue(rule["feasible"])  # surplus is 2000 >= 1000

    def test_10_percent_rule(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("5000"),
            monthly_expenses=Decimal("3000"),
        )
        suggestions = {s["rule"]: s for s in result["suggestions"]}
        rule = suggestions["10_percent"]
        self.assertEqual(rule["suggested_monthly_amount"], 500.0)  # 10% of 5000
        self.assertTrue(rule["feasible"])

    def test_surplus_rule(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("5000"),
            monthly_expenses=Decimal("3000"),
        )
        suggestions = {s["rule"]: s for s in result["suggestions"]}
        rule = suggestions["surplus"]
        self.assertEqual(rule["suggested_monthly_amount"], 2000.0)  # 5000 - 3000
        self.assertTrue(rule["feasible"])

    def test_infeasible_when_expenses_exceed_income(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("2000"),
            monthly_expenses=Decimal("2500"),
        )
        self.assertEqual(result["surplus"], -500.0)
        for suggestion in result["suggestions"]:
            self.assertFalse(suggestion["feasible"])

    def test_surplus_never_negative(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("1000"),
            monthly_expenses=Decimal("2000"),
        )
        suggestions = {s["rule"]: s for s in result["suggestions"]}
        # Surplus rule should return 0, not negative
        self.assertEqual(suggestions["surplus"]["suggested_monthly_amount"], 0.0)

    def test_zero_income(self):
        result = SavingRuleEngine.suggest(
            monthly_income=Decimal("0"),
            monthly_expenses=Decimal("0"),
        )
        for suggestion in result["suggestions"]:
            self.assertEqual(suggestion["suggested_monthly_amount"], 0.0)
