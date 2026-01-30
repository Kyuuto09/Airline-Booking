from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render

from .forms import AirlineForm, AirportForm, FlightForm, ReservationForm, SeatForm
from .models import Airline, Airport, Flight, Reservation, Seat


def flight_list(request):
    # 1. Base QuerySet
    flights = Flight.objects.all().select_related("airline", "origin", "airplane")

    # 2. Search Capability
    search_query = request.GET.get("q")
    if search_query:
        flights = flights.filter(
            Q(flight_number__icontains=search_query)
            | Q(airline__name__icontains=search_query)
            | Q(origin__city__icontains=search_query)
            | Q(origin__code__icontains=search_query)
        )

    # 3. Sorting Capability
    sort_by = request.GET.get("sort", "-id")  # Default to newest first
    # Allowed sort fields to prevent injection
    allowed_sorts = [
        "flight_number",
        "airline__name",
        "origin__city",
        "airplane__model",
        "id",
        "-id",
    ]
    if sort_by in allowed_sorts or (
        sort_by.startswith("-") and sort_by[1:] in allowed_sorts
    ):
        flights = flights.order_by(sort_by)

    # 4. Pagination Capability
    paginator = Paginator(flights, 10)  # Show 10 flights per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "flights": page_obj,
        "search_query": search_query,
        "current_sort": sort_by,
    }
    return render(request, "admin_panel/flight_list.html", context)


def flight_create(request):
    form = FlightForm(request.POST or None)
    if form.is_valid():
        flight = form.save()
        messages.success(
            request, f"Flight {flight.flight_number} created successfully!"
        )
        return redirect("admin_flight_list")
    return render(request, "admin_panel/flight_form.html", {"form": form})


def flight_update(request, id):
    flight = get_object_or_404(Flight, id=id)
    form = FlightForm(request.POST or None, instance=flight)
    if form.is_valid():
        flight = form.save()
        messages.info(request, f"Flight {flight.flight_number} updated successfully!")
        return redirect("admin_flight_list")
    return render(
        request, "admin_panel/flight_form.html", {"form": form, "title": "Edit Flight"}
    )


def flight_delete(request, id):
    flight = get_object_or_404(Flight, id=id)
    flight_number = flight.flight_number
    flight.delete()
    messages.error(request, f"Flight {flight_number} deleted successfully!")
    return redirect("admin_flight_list")


def airline_list(request):
    # 1. Base QuerySet
    airlines = Airline.objects.all()

    # 2. Search Capability
    search_query = request.GET.get("q")
    if search_query:
        airlines = airlines.filter(Q(name__icontains=search_query))

    # 3. Sorting
    sort_by = request.GET.get("sort", "name")
    if sort_by == "name" or sort_by == "-name":
        airlines = airlines.order_by(sort_by)

    # 4. Pagination
    paginator = Paginator(airlines, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "airlines": page_obj,
        "search_query": search_query,
        "current_sort": sort_by,
    }
    return render(request, "admin_panel/airline_list.html", context)


def airline_create(request):
    form = AirlineForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        airline = form.save()
        messages.success(request, f"Airline {airline.name} created successfully!")
        return redirect("admin_airline_list")
    return render(
        request,
        "admin_panel/airline_form.html",
        {"form": form, "title": "Add New Airline"},
    )


def airline_update(request, id):
    airline = get_object_or_404(Airline, id=id)
    form = AirlineForm(request.POST or None, request.FILES or None, instance=airline)
    if form.is_valid():
        airline = form.save()
        messages.info(request, f"Airline {airline.name} updated successfully!")
        return redirect("admin_airline_list")
    return render(
        request,
        "admin_panel/airline_form.html",
        {"form": form, "title": "Edit Airline"},
    )


def airline_delete(request, id):
    airline = get_object_or_404(Airline, id=id)
    name = airline.name
    airline.delete()
    messages.error(request, f"Airline {name} deleted successfully!")
    return redirect("admin_airline_list")


# === Airport Management ===
def airport_list(request):
    airports = Airport.objects.all()

    # Search
    search_query = request.GET.get("q")
    if search_query:
        airports = airports.filter(
            Q(name__icontains=search_query)
            | Q(code__icontains=search_query)
            | Q(city__icontains=search_query)
        )

    # Sort
    sort_by = request.GET.get("sort", "code")
    allowed = ["name", "code", "city", "country", "-name", "-code", "-city", "-country"]
    if sort_by in allowed:
        airports = airports.order_by(sort_by)

    # Pagination
    paginator = Paginator(airports, 15)
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "admin_panel/airport_list.html",
        {"airports": page_obj, "search_query": search_query, "current_sort": sort_by},
    )


def airport_create(request):
    form = AirportForm(request.POST or None)
    if form.is_valid():
        airport = form.save()
        messages.success(request, f"Airport {airport.code} created!")
        return redirect("admin_airport_list")
    return render(
        request, "admin_panel/airport_form.html", {"form": form, "title": "Add Airport"}
    )


def airport_update(request, id):
    airport = get_object_or_404(Airport, id=id)
    form = AirportForm(request.POST or None, instance=airport)
    if form.is_valid():
        form.save()
        messages.success(request, f"Airport {airport.code} updated!")
        return redirect("admin_airport_list")
    return render(
        request,
        "admin_panel/airport_form.html",
        {"form": form, "title": "Edit Airport"},
    )


def airport_delete(request, id):
    airport = get_object_or_404(Airport, id=id)
    airport.delete()
    messages.error(request, "Airport deleted!")
    return redirect("admin_airport_list")


# === Reservation Management ===
def reservation_list(request):
    reservations = Reservation.objects.select_related("user", "flight", "seat").all()

    # Search
    search_query = request.GET.get("q")
    if search_query:
        reservations = reservations.filter(
            Q(user__username__icontains=search_query)
            | Q(flight__flight_number__icontains=search_query)
            | Q(status__icontains=search_query)
        )

    # Sort
    sort_by = request.GET.get("sort", "-id")
    # Make sure to handle fields that might be foreign keys if sorting by them directly isn't supported easily without annotation,
    # but basic fields work.
    if sort_by.lstrip("-") in ["id", "status", "expires_at"]:
        reservations = reservations.order_by(sort_by)

    # Pagination
    paginator = Paginator(reservations, 10)
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "admin_panel/reservation_list.html",
        {
            "reservations": page_obj,
            "search_query": search_query,
            "current_sort": sort_by,
        },
    )


def reservation_create(request):
    form = ReservationForm(request.POST or None)
    if form.is_valid():
        r = form.save()
        messages.success(request, f"Reservation #{r.id} created!")
        return redirect("admin_reservation_list")
    return render(
        request,
        "admin_panel/reservation_form.html",
        {"form": form, "title": "Create Reservation"},
    )


def reservation_update(request, id):
    r = get_object_or_404(Reservation, id=id)
    form = ReservationForm(request.POST or None, instance=r)
    if form.is_valid():
        form.save()
        messages.success(request, f"Reservation #{r.id} updated!")
        return redirect("admin_reservation_list")
    return render(
        request,
        "admin_panel/reservation_form.html",
        {"form": form, "title": "Edit Reservation"},
    )


def reservation_delete(request, id):
    r = get_object_or_404(Reservation, id=id)
    r.delete()
    messages.error(request, f"Reservation #{id} deleted!")
    return redirect("admin_reservation_list")


# === Seat Management ===
def seat_list(request):
    seats = Seat.objects.select_related("airplane").all()

    # Search
    search_query = request.GET.get("q")
    if search_query:
        seats = seats.filter(
            Q(airplane__model__icontains=search_query)
            | Q(row__icontains=search_query)
            | Q(column__icontains=search_query)
        )

    # Sort
    sort_by = request.GET.get("sort", "id")
    if sort_by.lstrip("-") in ["id", "row", "column", "airplane__model"]:
        seats = seats.order_by(sort_by)

    # Pagination
    paginator = Paginator(seats, 50)  # More seats per page
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "admin_panel/seat_list.html",
        {"seats": page_obj, "search_query": search_query, "current_sort": sort_by},
    )


def seat_create(request):
    form = SeatForm(request.POST or None)
    if form.is_valid():
        seat = form.save()
        messages.success(request, f"Seat {seat} created!")
        return redirect("admin_seat_list")
    return render(
        request, "admin_panel/seat_form.html", {"form": form, "title": "Create Seat"}
    )


def seat_update(request, id):
    seat = get_object_or_404(Seat, id=id)
    form = SeatForm(request.POST or None, instance=seat)
    if form.is_valid():
        form.save()
        messages.success(request, f"Seat {seat} updated!")
        return redirect("admin_seat_list")
    return render(
        request, "admin_panel/seat_form.html", {"form": form, "title": "Edit Seat"}
    )


def seat_delete(request, id):
    seat = get_object_or_404(Seat, id=id)
    seat.delete()
    messages.error(request, "Seat deleted!")
    return redirect("admin_seat_list")
