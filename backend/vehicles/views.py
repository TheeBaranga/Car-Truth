from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Vehicle
from .serializers import VehicleSerializer


@api_view(["GET"])
def search_vehicle(request):
    query = request.query_params.get("query")

    if not query:
        return Response(
            {"error": "Please provide a VIN or registration number."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    normalized_query = query.replace(" ", "").upper()

    vehicle = Vehicle.objects.filter(
        vin__iexact=query
    ).first()

    if not vehicle:
        for candidate in Vehicle.objects.all():
            if candidate.registration_number.replace(" ", "").upper() == normalized_query:
                vehicle = candidate
                break

    if not vehicle:
        return Response(
            {"error": "Vehicle not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = VehicleSerializer(vehicle)

    return Response(serializer.data)