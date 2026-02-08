"""Saving plan views."""
from decimal import Decimal
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.users.models import Profile
from apps.transactions.models import Transaction
from .models import SavingPlan
from .serializers import SavingPlanSerializer
from .rules import SavingRuleEngine


class SavingPlanViewSet(viewsets.ModelViewSet):
    serializer_class = SavingPlanSerializer

    def get_queryset(self):
        return SavingPlan.objects.filter(user_id=self.request.user.id).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)


class SavingSuggestionsView(APIView):
    """
    GET /savings/suggestions/
    Returns rule-based saving suggestions based on income and expenses.
    """

    def get(self, request):
        try:
            profile = Profile.objects.get(id=request.user.id)
        except Profile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=404)

        monthly_income = profile.monthly_income or Decimal("0")

        # Sum of current month's expenses from budget plans or actual transactions
        from datetime import date

        today = date.today()
        monthly_expenses_agg = Transaction.objects.filter(
            user_id=request.user.id,
            type=Transaction.TYPE_EXPENSE,
            transaction_date__month=today.month,
            transaction_date__year=today.year,
        ).aggregate(total=Sum("amount"))
        monthly_expenses = monthly_expenses_agg["total"] or Decimal("0")

        return Response(
            SavingRuleEngine.suggest(monthly_income, monthly_expenses)
        )
