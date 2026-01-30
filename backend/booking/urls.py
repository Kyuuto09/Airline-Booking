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
    # Airline Admin URLs
    path("custom-admin/airlines/", admin_views.airline_list, name="admin_airline_list"),
    path(
        "custom-admin/airlines/create/",
        admin_views.airline_create,
        name="admin_airline_create",
    ),
    path(
        "custom-admin/airlines/<int:id>/edit/",
        admin_views.airline_update,
        name="admin_airline_update",
    ),
    path(
        "custom-admin/airlines/<int:id>/delete/",
        admin_views.airline_delete,
        name="admin_airline_delete",
    ),
    # Airport Admin URLs
    path("custom-admin/airports/", admin_views.airport_list, name="admin_airport_list"),
    path(
        "custom-admin/airports/create/",
        admin_views.airport_create,
        name="admin_airport_create",
    ),
    path(
        "custom-admin/airports/<int:id>/edit/",
        admin_views.airport_update,
        name="admin_airport_update",
    ),
    path(
        "custom-admin/airports/<int:id>/delete/",
        admin_views.airport_delete,
        name="admin_airport_delete",
    ),
    # Reservation Admin URLs
    path(
        "custom-admin/reservations/",
        admin_views.reservation_list,
        name="admin_reservation_list",
    ),
    path(
        "custom-admin/reservations/create/",
        admin_views.reservation_create,
        name="admin_reservation_create",
    ),
    path(
        "custom-admin/reservations/<int:id>/edit/",
        admin_views.reservation_update,
        name="admin_reservation_update",
    ),
    path(
        "custom-admin/reservations/<int:id>/delete/",
        admin_views.reservation_delete,
        name="admin_reservation_delete",
    ),
    # Seat Admin URLs
    path("custom-admin/seats/", admin_views.seat_list, name="admin_seat_list"),
    path(
        "custom-admin/seats/create/", admin_views.seat_create, name="admin_seat_create"
    ),
    path(
        "custom-admin/seats/<int:id>/edit/",
        admin_views.seat_update,
        name="admin_seat_update",
    ),
    path(
        "custom-admin/seats/<int:id>/delete/",
        admin_views.seat_delete,
        name="admin_seat_delete",
    ),
]
