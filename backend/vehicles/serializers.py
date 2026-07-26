from rest_framework import serializers
from .models import Vehicle, VehicleEvent


class VehicleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleEvent
        fields = [
            "event_type",
            "event_date",
            "title",
            "description",
            "source",
        ]


class VehicleSerializer(serializers.ModelSerializer):
    events = VehicleEventSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "vin",
            "registration_number",
            "make",
            "model",
            "year",
            "events",
        ]
