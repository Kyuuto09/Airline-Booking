# booking/api/views.py
from booking.models import Flight
from rest_framework.viewsets import ModelViewSet

from .serializers import FlightSerializer


class FlightViewSet(ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
