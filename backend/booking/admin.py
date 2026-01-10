from django.contrib import admin

from .models import Airline, Airplane, Airport, Flight, Reservation, Seat

# Register your models here.

admin.site.register(Airport)
admin.site.register(Airline)
admin.site.register(Airplane)
admin.site.register(Seat)
admin.site.register(Flight)
admin.site.register(Reservation)
