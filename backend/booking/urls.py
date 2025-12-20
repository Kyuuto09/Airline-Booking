from django.urls import path
from . import admin_views

urlpatterns = [
    path('custom-admin/flights/', admin_views.flight_list, name='admin_flight_list'),
    path('custom-admin/flights/create/', admin_views.flight_create, name='admin_flight_create'),
    path('custom-admin/flights/<int:id>/edit/', admin_views.flight_update, name='admin_flight_update'),
    path('custom-admin/flights/<int:id>/delete/', admin_views.flight_delete, name='admin_flight_delete'),
]
