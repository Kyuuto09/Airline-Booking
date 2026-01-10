# booking/api/views.py
from booking.models import Airline, Airplane, Airport, Flight
from rest_framework.viewsets import ModelViewSet

from .serializers import (
    AirlineSerializer,
    AirplaneSerializer,
    AirportSerializer,
    FlightSerializer,
)


class AirportViewSet(ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer


class AirplaneViewSet(ModelViewSet):
    queryset = Airplane.objects.all()
    serializer_class = AirplaneSerializer


class AirlineViewSet(ModelViewSet):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer


class FlightViewSet(ModelViewSet):
    queryset = Flight.objects.select_related(
        "airline", "airplane", "origin", "destination"
    ).all()
    serializer_class = FlightSerializer


class FlightViewSet(ModelViewSet):
    queryset = Flight.objects.select_related(
        "airline", "airplane", "origin", "destination"
    ).all()
    serializer_class = FlightSerializer
