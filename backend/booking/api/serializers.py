from booking.models import Airline, Airplane, Airport, Flight, Reservation, Seat
from rest_framework import serializers


class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ["id", "name", "code", "city", "country"]


class AirplaneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airplane
        fields = ["id", "model", "rows", "columns"]


class AirlineSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Airline
        fields = ["id", "name", "logo", "logo_url"]

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class FlightSerializer(serializers.ModelSerializer):
    origin_name = serializers.CharField(source="origin.name", read_only=True)
    origin_code = serializers.CharField(source="origin.code", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    destination_code = serializers.CharField(source="destination.code", read_only=True)
    airplane_name = serializers.CharField(source="airplane.model", read_only=True)
    airline_name = serializers.CharField(source="airline.name", read_only=True)
    airline_logo = serializers.SerializerMethodField()
    departure_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    arrival_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Flight
        fields = [
            "id",
            "flight_number",
            "airline",
            "airline_name",
            "airline_logo",
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

    def get_airline_logo(self, obj):
        if obj.airline and obj.airline.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.airline.logo.url)
            return obj.airline.logo.url
        return None


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = "__all__"
