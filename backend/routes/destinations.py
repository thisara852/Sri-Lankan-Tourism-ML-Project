"""
Destinations routes: list, search, detail
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.destination import Destination

destinations_bp = Blueprint("destinations", __name__)


@destinations_bp.route("/", methods=["GET"])
def list_destinations():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)
    category = request.args.get("category")
    climate  = request.args.get("climate")
    budget   = request.args.get("budget")
    search   = request.args.get("q")

    query = Destination.query

    if category:
        query = query.filter(Destination.category.ilike(f"%{category}%"))
    if climate:
        query = query.filter(Destination.climate.ilike(f"%{climate}%"))
    if budget:
        query = query.filter(Destination.budget_level == budget)
    if search:
        query = query.filter(
            Destination.name.ilike(f"%{search}%") |
            Destination.country.ilike(f"%{search}%") |
            Destination.description.ilike(f"%{search}%")
        )

    pagination = query.order_by(Destination.rating.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "destinations": [d.to_dict() for d in pagination.items],
        "total":        pagination.total,
        "page":         page,
        "pages":        pagination.pages,
    }), 200


@destinations_bp.route("/<int:dest_id>", methods=["GET"])
def get_destination(dest_id):
    dest = Destination.query.get_or_404(dest_id)
    return jsonify({"destination": dest.to_dict()}), 200
