from django.shortcuts import render, redirect, get_object_or_404
from .models import Flight
from .forms import FlightForm

def flight_list(request):
    flights = Flight.objects.all()
    return render(request, "admin_panel/flight_list.html", {"flights": flights})

def flight_create(request):
    form = FlightForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect("admin_flight_list")
    return render(request, "admin_panel/flight_form.html", {"form": form})

def flight_update(request, id):
    flight = get_object_or_404(Flight, id=id)
    form = FlightForm(request.POST or None, instance=flight)
    if form.is_valid():
        form.save()
        return redirect("admin_flight_list")
    return render(request, "admin_panel/flight_form.html", {"form": form, "title": "Edit Flight"})

def flight_delete(request, id):
    flight = get_object_or_404(Flight, id=id)
    flight.delete()
    return redirect("admin_flight_list")

