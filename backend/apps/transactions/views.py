"""Transaction views."""
from django.db.models import Sum, Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.categories.models import Category
from .models import Transaction
from .serializers import TransactionSerializer, TransactionSummarySerializer


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.filter(user_id=self.request.user.id)

        # Filters
        account_id = self.request.query_params.get("account_id")
        category_id = self.request.query_params.get("category_id")
        tx_type = self.request.query_params.get("type")
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")

        if account_id:
            qs = qs.filter(account_id=account_id)
        if category_id:
            qs = qs.filter(category_id=category_id)
        if tx_type:
            qs = qs.filter(type=tx_type)
        if date_from:
            qs = qs.filter(transaction_date__gte=date_from)
        if date_to:
            qs = qs.filter(transaction_date__lte=date_to)

        return qs

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """
        GET /transactions/summary/
        Spending totals grouped by category for a date range.
        Query params: date_from, date_to, type (default: expense)
        """
        tx_type = request.query_params.get("type", Transaction.TYPE_EXPENSE)
        qs = self.get_queryset().filter(type=tx_type)

        aggregated = (
            qs.values("category_id")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")
        )

        # Enrich with category names
        category_ids = [row["category_id"] for row in aggregated if row["category_id"]]
        categories = {
            str(c.id): c.name
            for c in Category.objects.filter(id__in=category_ids)
        }

        results = [
            {
                "category_id": row["category_id"],
                "category_name": categories.get(str(row["category_id"]), "Uncategorized"),
                "total": row["total"],
                "count": row["count"],
            }
            for row in aggregated
        ]

        serializer = TransactionSummarySerializer(results, many=True)
        return Response(serializer.data)
