from django.contrib import admin
from .models import Vehicle, VehicleEvent


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "registration_number",
        "vin",
        "make",
        "model",
        "year",
    )

    search_fields = (
        "registration_number",
        "vin",
    )


@admin.register(VehicleEvent)
class VehicleEventAdmin(admin.ModelAdmin):
    list_display = (
        "vehicle",
        "event_type",
        "event_date",
        "title",
        "source",
    )

    list_filter = (
        "event_type",
        "event_date",
    )

    search_fields = (
        "vehicle__registration_number",
        "vehicle__vin",
        "title",
        "description",
    )