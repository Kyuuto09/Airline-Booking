#!/bin/bash

# Collect static files
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate --no-input

# Start Gunicorn
gunicorn airline_booking.wsgi:application --bind=0.0.0.0:8000
