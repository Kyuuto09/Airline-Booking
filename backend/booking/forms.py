from django import forms

from .models import Airline, Airport, Flight, Reservation, Seat


class FlightForm(forms.ModelForm):
    class Meta:
        model = Flight
        fields = "__all__"
        widgets = {
            "departure_time": forms.DateTimeInput(
                attrs={
                    "type": "datetime-local",
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                }
            ),
            "arrival_time": forms.DateTimeInput(
                attrs={
                    "type": "datetime-local",
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                }
            ),
            "origin": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "destination": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "airline": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "airplane": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "flight_number": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "price": forms.NumberInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
        }


class AirlineForm(forms.ModelForm):
    class Meta:
        model = Airline
        fields = "__all__"
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "logo": forms.FileInput(
                attrs={
                    "class": "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                }
            ),
        }


class AirportForm(forms.ModelForm):
    class Meta:
        model = Airport
        fields = "__all__"
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "code": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "city": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "country": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
        }


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = "__all__"
        widgets = {
            "user": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "flight": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "seat": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "status": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "expires_at": forms.DateTimeInput(
                attrs={
                    "type": "datetime-local",
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                }
            ),
        }


class SeatForm(forms.ModelForm):
    class Meta:
        model = Seat
        fields = "__all__"
        widgets = {
            "airplane": forms.Select(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "row": forms.NumberInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
            "column": forms.TextInput(
                attrs={
                    "class": "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                }
            ),
        }
