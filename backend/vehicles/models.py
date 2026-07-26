from django.db import models

class Vehicle(models.Model):
    vin = models.CharField(max_length=17, unique=True)
    registration_number = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.make} {self.model} - {self.registration_number}"


class VehicleEvent(models.Model):
    EVENT_TYPES = [
        ('INSPECTION', 'Inspection'),
        ('MILEAGE', 'Mileage Update'),
        ('OWNERSHIP', 'Ownership Change'),
        ('SERVICE', 'Service'),
        ('ACCIDENT', 'Accident'),
    ]

    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='events'
    )
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_date = models.DateField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    source = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.title}"