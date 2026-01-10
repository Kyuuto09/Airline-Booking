# booking/api/urls.py
from rest_framework.routers import DefaultRouter

from .views import AirlineViewSet, AirplaneViewSet, AirportViewSet, FlightViewSet

router = DefaultRouter()
router.register(r"airports", AirportViewSet, basename="airport")
router.register(r"airplanes", AirplaneViewSet, basename="airplane")
router.register(r"airlines", AirlineViewSet, basename="airline")
router.register(r"flights", FlightViewSet, basename="flight")

urlpatterns = router.urls
