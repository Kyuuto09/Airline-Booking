from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from .forms import AirlineForm, FlightForm
from .models import Airline, Flight


def flight_list(request):
    flights = Flight.objects.all()
    return render(request, "admin_panel/flight_list.html", {"flights": flights})


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
    airlines = Airline.objects.all()
    return render(request, "admin_panel/airline_list.html", {"airlines": airlines})


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
