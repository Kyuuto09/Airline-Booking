from django import forms

from .models import Airline, Flight


class FlightForm(forms.ModelForm):
    class Meta:
        model = Flight
        fields = "__all__"


class AirlineForm(forms.ModelForm):
    class Meta:
        model = Airline
        fields = "__all__"

        fields = "__all__"
