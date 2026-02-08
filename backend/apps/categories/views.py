"""Category views."""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category
from .serializers import CategorySerializer

DEFAULT_CATEGORIES = [
    # Income
    {"name": "Salary", "type": "income", "icon": "briefcase", "color": "#22c55e"},
    {"name": "Freelance", "type": "income", "icon": "laptop", "color": "#16a34a"},
    {"name": "Business", "type": "income", "icon": "building", "color": "#15803d"},
    {"name": "Investment", "type": "income", "icon": "trending-up", "color": "#14532d"},
    {"name": "Gift", "type": "income", "icon": "gift", "color": "#bbf7d0"},
    # Expense
    {"name": "Food & Dining", "type": "expense", "icon": "utensils", "color": "#f97316"},
    {"name": "Transport", "type": "expense", "icon": "car", "color": "#3b82f6"},
    {"name": "Housing", "type": "expense", "icon": "home", "color": "#8b5cf6"},
    {"name": "Utilities", "type": "expense", "icon": "zap", "color": "#eab308"},
    {"name": "Healthcare", "type": "expense", "icon": "heart", "color": "#ef4444"},
    {"name": "Entertainment", "type": "expense", "icon": "film", "color": "#ec4899"},
    {"name": "Shopping", "type": "expense", "icon": "shopping-bag", "color": "#f59e0b"},
    {"name": "Education", "type": "expense", "icon": "book", "color": "#06b6d4"},
    {"name": "Other", "type": "expense", "icon": "more-horizontal", "color": "#94a3b8"},
]


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user_id=self.request.user.id).order_by(
            "type", "name"
        )

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)

    @action(detail=False, methods=["post"])
    def seed_defaults(self, request):
        """POST /categories/seed_defaults/ — create default categories."""
        created_count = 0
        for cat_data in DEFAULT_CATEGORIES:
            _, created = Category.objects.get_or_create(
                user_id=request.user.id,
                name=cat_data["name"],
                type=cat_data["type"],
                defaults={
                    "icon": cat_data["icon"],
                    "color": cat_data["color"],
                    "is_default": True,
                },
            )
            if created:
                created_count += 1
        return Response(
            {"created": created_count, "message": f"{created_count} default categories created."},
            status=status.HTTP_201_CREATED,
        )
