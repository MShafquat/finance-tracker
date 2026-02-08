"""Dashboard aggregated view."""
from decimal import Decimal
from datetime import date
from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.models import Account
from apps.transactions.models import Transaction
from apps.budgets.models import BudgetPlan
from apps.categories.models import Category


class DashboardView(APIView):
    """
    GET /dashboard/
    Returns all data needed for the dashboard in a single request:
    - Consolidated balance (non-credit-card accounts)
    - Credit card summary
    - Recent transactions (last 10)
    - Current month income vs expense totals
    - Budget overview (top 5 categories)
    """

    def get(self, request):
        user_id = request.user.id
        today = date.today()

        # --- Accounts ---
        all_accounts = Account.objects.filter(user_id=user_id, is_active=True)
        non_cc_accounts = all_accounts.exclude(type=Account.TYPE_CREDIT_CARD)
        cc_accounts = all_accounts.filter(type=Account.TYPE_CREDIT_CARD)

        consolidated_balance = float(
            sum(acc.current_balance for acc in non_cc_accounts)
        )

        credit_cards = [
            {
                "id": str(acc.id),
                "name": acc.name,
                "provider": acc.provider,
                "current_balance": float(acc.current_balance),
                "credit_limit": float(acc.credit_limit) if acc.credit_limit else None,
                "billing_date": acc.billing_date,
                "due_date": acc.due_date,
            }
            for acc in cc_accounts
        ]

        # --- Recent transactions ---
        recent_txs = Transaction.objects.filter(user_id=user_id).order_by(
            "-transaction_date", "-created_at"
        )[:10]

        recent_list = [
            {
                "id": str(tx.id),
                "type": tx.type,
                "amount": float(tx.amount),
                "description": tx.description,
                "transaction_date": tx.transaction_date.isoformat(),
                "account_id": str(tx.account_id),
                "category_id": str(tx.category_id) if tx.category_id else None,
            }
            for tx in recent_txs
        ]

        # --- Monthly totals ---
        monthly = (
            Transaction.objects.filter(
                user_id=user_id,
                transaction_date__month=today.month,
                transaction_date__year=today.year,
            )
            .values("type")
            .annotate(total=Sum("amount"))
        )
        monthly_map = {row["type"]: float(row["total"]) for row in monthly}

        # --- Top budget categories progress ---
        budgets = BudgetPlan.objects.filter(
            user_id=user_id, month=today.month, year=today.year
        )[:5]
        actuals = (
            Transaction.objects.filter(
                user_id=user_id,
                type=Transaction.TYPE_EXPENSE,
                transaction_date__month=today.month,
                transaction_date__year=today.year,
            )
            .values("category_id")
            .annotate(total=Sum("amount"))
        )
        actual_map = {str(row["category_id"]): float(row["total"]) for row in actuals}
        category_ids = list(budgets.values_list("category_id", flat=True))
        categories = {
            str(c.id): c.name
            for c in Category.objects.filter(id__in=category_ids)
        }

        budget_overview = [
            {
                "category_id": str(b.category_id),
                "category_name": categories.get(str(b.category_id), "Unknown"),
                "planned": float(b.planned_amount),
                "actual": actual_map.get(str(b.category_id), 0),
            }
            for b in budgets
        ]

        return Response(
            {
                "consolidated_balance": consolidated_balance,
                "credit_cards": credit_cards,
                "recent_transactions": recent_list,
                "monthly_income": monthly_map.get(Transaction.TYPE_INCOME, 0),
                "monthly_expenses": monthly_map.get(Transaction.TYPE_EXPENSE, 0),
                "budget_overview": budget_overview,
                "current_month": {"month": today.month, "year": today.year},
            }
        )
