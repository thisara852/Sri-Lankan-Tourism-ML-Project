"""
Recommendations route — calls the ML engine and returns ranked destinations
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_profile import UserProfile
from ml.recommender import get_recommendations

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.route("/", methods=["GET"])
@jwt_required()
def recommend():
    user_id = int(get_jwt_identity())
    top_n   = request.args.get("top_n", 10, type=int)

    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Please complete the questionnaire first"}), 400

    results = get_recommendations(profile, top_n=top_n)
    return jsonify({"recommendations": results}), 200
