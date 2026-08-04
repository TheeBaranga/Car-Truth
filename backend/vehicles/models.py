from django.db import models

class Vehicle(models.Model):
    vin = models.CharField(max_length=17, unique=True)
    registration_number = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=50, blank=True)
    body_type = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=50, blank=True)
    engine_capacity = models.CharField(max_length=20, blank=True)
    #transmission = models.CharField(max_length=50, blank=True)
    #drive_type = models.CharField(max_length=50, blank=True)
    #mileage = models.PositiveIntegerField(blank=True, null=True)
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.make} {self.model} - {self.registration_number}"

    @property
    def trust_score(self):
        score = 50

        if self.vin:
            score += 10

        if self.color:
            score += 5

        if self.body_type:
            score += 5

        if self.fuel_type:
            score += 5

        if self.engine_capacity:
            score += 5

        if self.events.exists():
            score += 20

        return min(score, 100)


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


class OwnershipRecord(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='ownership_records'
    )

    owner_name = models.CharField(max_length=255)

    acquired_date = models.DateField()

    transferred_date = models.DateField(null=True, blank=True)

    is_current_owner = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-acquired_date']

    def __str__(self):

        return f"{self.owner_name} - {self.vehicle.registration_number}"

    