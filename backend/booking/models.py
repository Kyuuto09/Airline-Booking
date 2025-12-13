from django.db import models


# Create your models here.
class Booking(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()

    def __str__(self):
        return f"Booking: {self.title}"
