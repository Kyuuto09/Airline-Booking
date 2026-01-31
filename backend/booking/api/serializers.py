from booking.models import Airline, Airplane, Airport, Flight, Reservation, Seat
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


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
    origin_city = serializers.CharField(source="origin.city", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    destination_code = serializers.CharField(source="destination.code", read_only=True)
    destination_city = serializers.CharField(source="destination.city", read_only=True)
    airplane_name = serializers.CharField(source="airplane.model", read_only=True)
    airline_name = serializers.CharField(source="airline.name", read_only=True)
    airline_logo = serializers.SerializerMethodField()
    departure_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    arrival_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

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
            "origin_city",
            "destination",
            "destination_name",
            "destination_code",
            "destination_city",
            "airplane",
            "airplane_name",
            "departure_time",
            "arrival_time",
            "price",
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


class ReservationSerializer(serializers.ModelSerializer):
    flight_details = FlightSerializer(source="flight", read_only=True)
    seat_details = SeatSerializer(source="seat", read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "user",
            "flight",
            "seat",
            "status",
            "expires_at",
            "flight_details",
            "seat_details",
        ]
        read_only_fields = ["user", "expires_at"]
