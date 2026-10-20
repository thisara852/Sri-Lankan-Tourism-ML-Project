"""
Questionnaire route: save / update user travel preferences
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.user_profile import UserProfile
import json

questionnaire_bp = Blueprint("questionnaire", __name__)


@questionnaire_bp.route("/", methods=["POST"])
@jwt_required()
def save_questionnaire():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)

    profile.travel_style         = data.get("travel_style", profile.travel_style)
    profile.budget_preference    = data.get("budget_preference", profile.budget_preference)
    profile.climate_pref         = data.get("climate_pref", profile.climate_pref)
    profile.preferred_activities = json.dumps(data.get("preferred_activities", []))
    profile.group_type           = data.get("group_type", profile.group_type)
    profile.trip_duration        = data.get("trip_duration", profile.trip_duration)
    profile.accessibility_needs  = data.get("accessibility_needs", profile.accessibility_needs or False)

    db.session.commit()
    return jsonify({"message": "Profile updated", "profile": profile.to_dict()}), 200


@questionnaire_bp.route("/", methods=["GET"])
@jwt_required()
def get_questionnaire():
    user_id = int(get_jwt_identity())
    profile = UserProfile.query.filter_by(user_id=user_id).first_or_404()
    return jsonify({"profile": profile.to_dict()}), 200
