from booking.models import Airplane, Airport, Flight, Reservation, Seat
from rest_framework import serializers


class FlightSerializer(serializers.ModelSerializer):
    origin_name = serializers.CharField(source="origin.name", read_only=True)
    origin_code = serializers.CharField(source="origin.code", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    destination_code = serializers.CharField(source="destination.code", read_only=True)
    airplane_name = serializers.CharField(source="airplane.model", read_only=True)
    departure_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    arrival_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Flight
        fields = [
            "id",
            "flight_number",
            "origin",
            "origin_name",
            "origin_code",
            "destination",
            "destination_name",
            "destination_code",
            "airplane",
            "airplane_name",
            "departure_time",
            "arrival_time",
        ]


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = "__all__"
