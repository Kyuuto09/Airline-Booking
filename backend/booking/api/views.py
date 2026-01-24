# booking/api/views.py
from booking.models import Airline, Airplane, Airport, Flight
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .serializers import (
    AirlineSerializer,
    AirplaneSerializer,
    AirportSerializer,
    FlightSerializer,
    UserSerializer,
)


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


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
    filter_backends = [OrderingFilter]
    ordering_fields = ["departure_time"]
    ordering = ["departure_time"]

    def get_queryset(self):
        queryset = super().get_queryset()
        origin = self.request.query_params.get("origin", None)
        destination = self.request.query_params.get("destination", None)

        if origin:
            queryset = queryset.filter(
                Q(origin__city__icontains=origin) | Q(origin__code__icontains=origin)
            )

        if destination:
            queryset = queryset.filter(
                Q(destination__city__icontains=destination)
                | Q(destination__code__icontains=destination)
            )

        return queryset

    def retrieve(self, request, *args, **kwargs):
        # Get the flight
        flight = self.get_object()

        # Track in session
        recent = request.session.get("recently_viewed", [])
        flight_id = flight.id

        print(f"\n=== Flight Detail Retrieved ===")
        print(f"Flight ID: {flight_id}")
        print(f"Current session recently_viewed: {recent}")
        print(f"Session key: {request.session.session_key}")

        # Remove if already exists (to move to front)
        if flight_id in recent:
            recent.remove(flight_id)

        # Add to beginning
        recent.insert(0, flight_id)

        # Keep only last 5
        recent = recent[:5]

        # Save to session
        request.session["recently_viewed"] = recent
        request.session.modified = True

        print(f"Updated recently_viewed: {recent}")
        print(f"Session saved: {request.session.session_key}")
        print("=" * 30 + "\n")

        # Return normal response
        serializer = self.get_serializer(flight)
        return Response(serializer.data)


@api_view(["GET", "DELETE"])
def recently_viewed(request):
    """Get or clear recently viewed flights"""
    if request.method == "GET":
        # Get flight IDs from session
        recent_ids = request.session.get("recently_viewed", [])

        print(f"\n=== Recently Viewed Request ===")
        print(f"Session key: {request.session.session_key}")
        print(f"Recently viewed IDs: {recent_ids}")
        print("=" * 30 + "\n")

        if not recent_ids:
            return Response([])

        # Fetch flights
        flights = Flight.objects.filter(id__in=recent_ids).select_related(
            "airline", "airplane", "origin", "destination"
        )

        # Sort by session order
        flights_dict = {f.id: f for f in flights}
        ordered_flights = [
            flights_dict[fid] for fid in recent_ids if fid in flights_dict
        ]

        # Serialize
        serializer = FlightSerializer(
            ordered_flights, many=True, context={"request": request}
        )
        return Response(serializer.data)

    elif request.method == "DELETE":
        # Clear all recently viewed
        request.session["recently_viewed"] = []
        request.session.modified = True
        return Response({"message": "Recently viewed cleared"})


@api_view(["DELETE"])
def remove_from_recent(request, flight_id):
    """Remove a specific flight from recently viewed"""
    recent = request.session.get("recently_viewed", [])

    if flight_id in recent:
        recent.remove(flight_id)
        request.session["recently_viewed"] = recent
        request.session.modified = True

    return Response({"message": "Flight removed from recently viewed"})
