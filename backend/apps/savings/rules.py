"""Rule-based saving suggestion engine. Future: replace/augment with AI."""
from decimal import Decimal


class SavingRuleEngine:
    """
    Generates saving suggestions based on income and expenses.
    Each rule is self-contained and returns a suggestion dict.
    """

    @classmethod
    def suggest(cls, monthly_income: Decimal, monthly_expenses: Decimal) -> dict:
        surplus = monthly_income - monthly_expenses
        suggestions = [
            cls._rule_50_30_20(monthly_income, surplus),
            cls._rule_10_percent(monthly_income, surplus),
            cls._rule_surplus(surplus),
        ]
        return {
            "monthly_income": float(monthly_income),
            "monthly_expenses": float(monthly_expenses),
            "surplus": float(surplus),
            "suggestions": suggestions,
        }

    @classmethod
    def _rule_50_30_20(cls, income: Decimal, surplus: Decimal) -> dict:
        amount = income * Decimal("0.20")
        return {
            "rule": "50_30_20",
            "name": "50/30/20 Rule",
            "description": "Allocate 50% to needs, 30% to wants, 20% to savings.",
            "suggested_monthly_amount": float(amount),
            "feasible": surplus >= amount,
        }

    @classmethod
    def _rule_10_percent(cls, income: Decimal, surplus: Decimal) -> dict:
        amount = income * Decimal("0.10")
        return {
            "rule": "10_percent",
            "name": "10% Rule",
            "description": "Save at least 10% of your monthly income.",
            "suggested_monthly_amount": float(amount),
            "feasible": surplus >= amount,
        }

    @classmethod
    def _rule_surplus(cls, surplus: Decimal) -> dict:
        amount = max(surplus, Decimal("0"))
        return {
            "rule": "surplus",
            "name": "Surplus Savings",
            "description": "Save everything left after planned expenses.",
            "suggested_monthly_amount": float(amount),
            "feasible": surplus > 0,
        }
