from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet

booking_router = DefaultRouter()
booking_router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = booking_router.urls
