from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from .forms import FlightForm
from .models import Flight


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

    return redirect("admin_flight_list")
