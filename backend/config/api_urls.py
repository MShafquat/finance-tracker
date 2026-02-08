"""API v1 URL routing."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.users.views import ProfileViewSet, AuthSyncView
from apps.accounts.views import AccountViewSet
from apps.transactions.views import TransactionViewSet
from apps.categories.views import CategoryViewSet
from apps.budgets.views import BudgetPlanViewSet
from apps.savings.views import SavingPlanViewSet, SavingSuggestionsView
from apps.dashboard.views import DashboardView
from utils.views import HealthCheckView

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"accounts", AccountViewSet, basename="account")
router.register(r"transactions", TransactionViewSet, basename="transaction")
router.register(r"budgets", BudgetPlanViewSet, basename="budget")
router.register(r"savings/plans", SavingPlanViewSet, basename="saving-plan")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/sync/", AuthSyncView.as_view(), name="auth-sync"),
    path("auth/me/", ProfileViewSet.as_view({"get": "me"}), name="auth-me"),
    path("savings/suggestions/", SavingSuggestionsView.as_view(), name="savings-suggestions"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("health/", HealthCheckView.as_view(), name="health"),
]
