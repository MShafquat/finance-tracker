"""Budget plan views."""
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date

from apps.categories.models import Category
from apps.transactions.models import Transaction
from .models import BudgetPlan
from .serializers import BudgetPlanSerializer, BudgetProgressSerializer


class BudgetPlanViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetPlanSerializer

    def get_queryset(self):
        qs = BudgetPlan.objects.filter(user_id=self.request.user.id)
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        if month:
            qs = qs.filter(month=month)
        if year:
            qs = qs.filter(year=year)
        return qs.order_by("year", "month")

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)

    @action(detail=False, methods=["get"])
    def progress(self, request):
        """
        GET /budgets/progress/
        Budget vs actual spending for a given month/year.
        Defaults to current month.
        """
        today = date.today()
        month = int(request.query_params.get("month", today.month))
        year = int(request.query_params.get("year", today.year))

        budgets = BudgetPlan.objects.filter(
            user_id=request.user.id, month=month, year=year
        )

        # Actual spending per category for this month
        actuals = (
            Transaction.objects.filter(
                user_id=request.user.id,
                type=Transaction.TYPE_EXPENSE,
                transaction_date__month=month,
                transaction_date__year=year,
            )
            .values("category_id")
            .annotate(total=Sum("amount"))
        )
        actual_map = {str(row["category_id"]): row["total"] for row in actuals}

        category_ids = list(budgets.values_list("category_id", flat=True))
        categories = {
            str(c.id): c.name
            for c in Category.objects.filter(id__in=category_ids)
        }

        results = []
        for budget in budgets:
            actual = actual_map.get(str(budget.category_id), 0)
            planned = budget.planned_amount
            remaining = planned - actual
            pct = float(actual / planned * 100) if planned > 0 else 0.0
            results.append(
                {
                    "category_id": budget.category_id,
                    "category_name": categories.get(str(budget.category_id), "Unknown"),
                    "planned_amount": planned,
                    "actual_amount": actual,
                    "remaining": remaining,
                    "percentage_used": round(pct, 1),
                }
            )

        serializer = BudgetProgressSerializer(results, many=True)
        return Response({"month": month, "year": year, "progress": serializer.data})
