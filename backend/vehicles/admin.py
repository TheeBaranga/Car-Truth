from django.contrib import admin
from .models import Vehicle, VehicleEvent, OwnershipRecord


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

@admin.register(OwnershipRecord)
class OwnershipRecordAdmin(admin.ModelAdmin):
    list_display = (
        'vehicle',
        'owner_number',
        'acquired_date',
        'transferred_date',
        'is_current_owner',
    )

    list_filter = (
        'acquired_date',
        'transferred_date',
        'is_current_owner',
    )

    search_fields = (
        'vehicle__registration_number',
        'vehicle__vin',
    )