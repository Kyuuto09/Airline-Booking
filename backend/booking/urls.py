from django.http import JsonResponse
from django.urls import path

from . import admin_views


def api_root(request):
    """Root endpoint showing available API endpoints"""
    return JsonResponse(
        {
            "message": "Airline Booking API",
            "status": "running",
            "endpoints": {
                "flights": "/api/flights/",
                "recently_viewed": "/api/recently-viewed/",
                "admin_panel": "/admin/",
                "custom_admin": "/custom-admin/flights/",
            },
        }
    )


urlpatterns = [
    path("", api_root, name="api_root"),
    path("custom-admin/flights/", admin_views.flight_list, name="admin_flight_list"),
    path(
        "custom-admin/flights/create/",
        admin_views.flight_create,
        name="admin_flight_create",
    ),
    path(
        "custom-admin/flights/<int:id>/edit/",
        admin_views.flight_update,
        name="admin_flight_update",
    ),
    path(
        "custom-admin/flights/<int:id>/delete/",
        admin_views.flight_delete,
        name="admin_flight_delete",
    ),
]
