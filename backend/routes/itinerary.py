"""
Itinerary routes: CRUD for user travel plans
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.itinerary import Itinerary
import json
from datetime import date

itinerary_bp = Blueprint("itinerary", __name__)


@itinerary_bp.route("/", methods=["GET"])
@jwt_required()
def list_itineraries():
    user_id = int(get_jwt_identity())
    items   = Itinerary.query.filter_by(user_id=user_id).order_by(Itinerary.created_at.desc()).all()
    return jsonify({"itineraries": [i.to_dict() for i in items]}), 200


@itinerary_bp.route("/", methods=["POST"])
@jwt_required()
def create_itinerary():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    itin = Itinerary(
        user_id=user_id,
        title=data.get("title", "My Trip"),
        destinations=json.dumps(data.get("destinations", [])),
        activities=json.dumps(data.get("activities", [])),
        notes=data.get("notes"),
        is_public=data.get("is_public", False),
    )

    # Parse optional dates
    if data.get("start_date"):
        itin.start_date = date.fromisoformat(data["start_date"])
    if data.get("end_date"):
        itin.end_date = date.fromisoformat(data["end_date"])

    db.session.add(itin)
    db.session.commit()
    return jsonify({"itinerary": itin.to_dict()}), 201


@itinerary_bp.route("/<int:itin_id>", methods=["GET"])
@jwt_required()
def get_itinerary(itin_id):
    user_id = int(get_jwt_identity())
    itin    = Itinerary.query.filter_by(id=itin_id, user_id=user_id).first_or_404()
    return jsonify({"itinerary": itin.to_dict()}), 200


@itinerary_bp.route("/<int:itin_id>", methods=["PUT"])
@jwt_required()
def update_itinerary(itin_id):
    user_id = int(get_jwt_identity())
    itin    = Itinerary.query.filter_by(id=itin_id, user_id=user_id).first_or_404()
    data    = request.get_json()

    itin.title        = data.get("title", itin.title)
    itin.notes        = data.get("notes", itin.notes)
    itin.is_public    = data.get("is_public", itin.is_public)
    itin.destinations = json.dumps(data.get("destinations", itin.get_destinations()))
    itin.activities   = json.dumps(data.get("activities",   itin.get_activities()))

    if data.get("start_date"):
        itin.start_date = date.fromisoformat(data["start_date"])
    if data.get("end_date"):
        itin.end_date = date.fromisoformat(data["end_date"])

    db.session.commit()
    return jsonify({"itinerary": itin.to_dict()}), 200


@itinerary_bp.route("/<int:itin_id>", methods=["DELETE"])
@jwt_required()
def delete_itinerary(itin_id):
    user_id = int(get_jwt_identity())
    itin    = Itinerary.query.filter_by(id=itin_id, user_id=user_id).first_or_404()
    db.session.delete(itin)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
