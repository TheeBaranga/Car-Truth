from rest_framework import serializers
from .models import Vehicle, VehicleEvent, OwnershipRecord

trust_score = serializers.ReadOnlyField()

class OwnershipRecordSerializer(serializers.ModelSerializer):
        class Meta:
            model = OwnershipRecord
            fields = '__all__'

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
    ownership_records = OwnershipRecordSerializer(
        many=True,
        read_only=True
    )
    trust_score = serializers.ReadOnlyField()


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
            "ownership_records",
            "body_type",
            "fuel_type",
            "engine_capacity",
            "color",
            "trust_score",
            "created_at",
            "updated_at",
        ]

    