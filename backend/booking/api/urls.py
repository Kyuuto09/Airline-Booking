# booking/api/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AirlineViewSet,
    AirplaneViewSet,
    AirportViewSet,
    FlightViewSet,
    recently_viewed,
    remove_from_recent,
)

router = DefaultRouter()
router.register(r"airports", AirportViewSet, basename="airport")
router.register(r"airplanes", AirplaneViewSet, basename="airplane")
router.register(r"airlines", AirlineViewSet, basename="airline")
router.register(r"flights", FlightViewSet, basename="flight")

urlpatterns = [
    path("recently-viewed/", recently_viewed, name="recently-viewed"),
    path("recently-viewed/<int:flight_id>/", remove_from_recent, name="remove-recent"),
] + router.urls
