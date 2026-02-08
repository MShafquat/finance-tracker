"""Category serializers."""
from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "type",
            "icon",
            "color",
            "is_default",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
