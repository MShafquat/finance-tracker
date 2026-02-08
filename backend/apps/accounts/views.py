"""Account views."""
from decimal import Decimal
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Account
from .serializers import AccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.filter(
            user_id=self.request.user.id, is_active=True
        ).order_by("type", "name")

    def perform_create(self, serializer):
        # Set initial balance as starting current_balance
        initial = serializer.validated_data.get("initial_balance", Decimal("0"))
        serializer.save(user_id=self.request.user.id, current_balance=initial)

    @action(detail=False, methods=["get"])
    def consolidated_balance(self, request):
        """
        GET /accounts/consolidated_balance/
        Total balance across all accounts EXCLUDING credit cards.
        """
        accounts = self.get_queryset().exclude(type=Account.TYPE_CREDIT_CARD)
        total = sum(acc.current_balance for acc in accounts)
        account_data = [
            {
                "id": str(acc.id),
                "name": acc.name,
                "type": acc.type,
                "provider": acc.provider,
                "balance": float(acc.current_balance),
                "currency_code": acc.currency_code,
            }
            for acc in accounts
        ]
        return Response(
            {
                "total_balance": float(total),
                "accounts": account_data,
            }
        )

    @action(detail=False, methods=["get"])
    def credit_cards(self, request):
        """
        GET /accounts/credit_cards/
        Credit card accounts with billing/due date info.
        """
        cards = self.get_queryset().filter(type=Account.TYPE_CREDIT_CARD)
        serializer = self.get_serializer(cards, many=True)
        return Response(serializer.data)
