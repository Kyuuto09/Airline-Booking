# booking/api/views.py
from booking.models import Airline, Airplane, Airport, Flight, Reservation, Seat
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import permissions, status
from rest_framework.decorators import action, api_view
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
    ReservationSerializer,
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

    @action(detail=True, methods=["get"])
    def seats(self, request, pk=None):
        """
        Get all seats for this flight's airplane
        AND mark which ones are already taken.
        Auto-generates seats if they don't exist yet.
        """
        flight = self.get_object()
        airplane = flight.airplane

        # 1. Get all physical seats on this airplane
        all_seats = Seat.objects.filter(airplane=airplane)

        # Lazy initialization: If no seats exist, create them based on aircraft config
        if not all_seats.exists() and airplane.rows > 0 and airplane.columns > 0:
            seats_to_create = []
            # Letters A, B, C, D, E, F...
            col_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

            for r in range(1, airplane.rows + 1):
                # Ensure we don't go out of bounds on letters (though unlimited cols unlikely)
                actual_cols = min(airplane.columns, len(col_letters))
                for c_idx in range(actual_cols):
                    seats_to_create.append(
                        Seat(airplane=airplane, row=r, column=col_letters[c_idx])
                    )

            if seats_to_create:
                Seat.objects.bulk_create(seats_to_create)
                all_seats = Seat.objects.filter(airplane=airplane)

        # 2. Find out which seats are already reserved for THIS specific flight
        reserved_seat_ids = (
            Reservation.objects.filter(flight=flight)
            .exclude(status="CANCELLED")
            .values_list("seat_id", flat=True)
        )

        # 3. Build the data response manually
        seat_data = []
        for seat in all_seats:
            seat_data.append(
                {
                    "id": seat.id,
                    "row": seat.row,
                    "column": seat.column,
                    "is_reserved": seat.id in reserved_seat_ids,
                }
            )

        return Response(seat_data)

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


from datetime import timedelta

from django.utils import timezone
from rest_framework.exceptions import ValidationError


class ReservationViewSet(ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own reservations
        return Reservation.objects.filter(user=self.request.user).order_by("-id")

    def perform_create(self, serializer):
        flight = serializer.validated_data["flight"]
        seat = serializer.validated_data["seat"]

        # Check if seat is already taken for this flight
        if (
            Reservation.objects.filter(flight=flight, seat=seat)
            .exclude(status="CANCELLED")
            .exists()
        ):
            raise ValidationError({"detail": "This seat is already reserved."})

        # Set default expiry (24h) and user
        serializer.save(
            user=self.request.user,
            expires_at=timezone.now() + timedelta(days=1),
            status="CONFIRMED",
        )
