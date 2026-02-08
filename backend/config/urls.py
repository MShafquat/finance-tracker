"""URL configuration for personal-finance-assist."""
from django.urls import path, include

urlpatterns = [
    path("api/v1/", include("config.api_urls")),
]
