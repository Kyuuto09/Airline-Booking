from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Airport(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)


class Airplane(models.Model):
    model = models.CharField(max_length=50)
    rows = models.IntegerField()
    columns = models.IntegerField()


class Seat(models.Model):
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE)
    row = models.IntegerField()
    column = models.CharField(max_length=1)


class Flight(models.Model):
    flight_number = models.CharField(max_length=10)
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE)
    origin = models.ForeignKey(
        Airport, related_name="departures", on_delete=models.CASCADE
    )
    destination = models.ForeignKey(
        Airport, related_name="arrivals", on_delete=models.CASCADE
    )
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()


class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=[
            ("LOCKED", "Locked"),
            ("CONFIRMED", "Confirmed"),
            ("EXPIRED", "Expired"),
        ],
    )
    expires_at = models.DateTimeField()
