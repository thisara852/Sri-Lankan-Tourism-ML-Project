"""
Behaviour tracking routes — log user interactions (click, search, favourite, rate)
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.behaviour import UserBehaviour
from models.user_profile import UserProfile
import json

behaviour_bp = Blueprint("behaviour", __name__)

VALID_EVENTS = {"search", "click", "favourite", "rate"}


@behaviour_bp.route("/track", methods=["POST"])
@jwt_required()
def track():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    event_type = data.get("event_type")
    if event_type not in VALID_EVENTS:
        return jsonify({"error": f"event_type must be one of {VALID_EVENTS}"}), 400

    event = UserBehaviour(
        user_id=user_id,
        event_type=event_type,
        destination_id=data.get("destination_id"),
        search_query=data.get("search_query"),
        rating_given=data.get("rating_given"),
    )
    db.session.add(event)

    # If user favourited a destination, update their profile favourites list
    if event_type == "favourite" and data.get("destination_id"):
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if profile:
            favs = profile.get_favourites()
            dest_id = data["destination_id"]
            if dest_id not in favs:
                favs.append(dest_id)
            else:
                favs.remove(dest_id)   # toggle off
            profile.favourites = json.dumps(favs)

    db.session.commit()
    return jsonify({"message": "Event tracked"}), 201


@behaviour_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    events  = (
        UserBehaviour.query
        .filter_by(user_id=user_id)
        .order_by(UserBehaviour.timestamp.desc())
        .limit(100)
        .all()
    )
    return jsonify({"events": [e.to_dict() for e in events]}), 200
