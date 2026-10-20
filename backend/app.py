"""
Smart Tourism Recommendation System
Main Flask Application Entry Point
"""

import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from database import db
from routes.auth import auth_bp
from routes.destinations import destinations_bp
from routes.recommendations import recommendations_bp
from routes.questionnaire import questionnaire_bp
from routes.itinerary import itinerary_bp
from routes.behaviour import behaviour_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # ── Configuration ─────────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "smart-tourism-jwt-secret-key-32-bytes-long!")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///smart_tourism.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Extensions ────────────────────────────────────────────────────────────
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    JWTManager(app)

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(auth_bp,            url_prefix="/api/auth")
    app.register_blueprint(destinations_bp,    url_prefix="/api/destinations")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(questionnaire_bp,   url_prefix="/api/questionnaire")
    app.register_blueprint(itinerary_bp,       url_prefix="/api/itinerary")
    app.register_blueprint(behaviour_bp,       url_prefix="/api/behaviour")

    # ── Create tables & seed data ──────────────────────────────────────────────
    with app.app_context():
        db.create_all()
        _seed_demo_user_if_empty()
        _seed_destinations_if_empty()

    return app


def _clean_float(val, default=0.0):
    if val is None:
        return default
    try:
        val_str = str(val).strip().replace("−", "-").replace("\u2212", "-")
        return float(val_str)
    except (ValueError, TypeError):
        return default


def _seed_demo_user_if_empty():
    """Ensure a default demo user exists for immediate login testing."""
    from models.user import User
    from models.user_profile import UserProfile
    from werkzeug.security import generate_password_hash
    import json

    try:
        demo = User.query.filter_by(username="demo").first()
        if not demo:
            demo = User(
                email="demo@tourism.com",
                username="demo",
                password_hash=generate_password_hash("password123"),
            )
            db.session.add(demo)
            db.session.flush()

            profile = UserProfile(
                user_id=demo.id,
                travel_style="adventure",
                budget_preference="medium",
                climate_pref="temperate",
                preferred_activities=json.dumps(["Sightseeing", "Hiking", "Food tours"]),
                group_type="solo",
                trip_duration=5,
            )
            db.session.add(profile)
            db.session.commit()
            print("[SEED] Created demo user -> Username: demo | Email: demo@tourism.com | Password: password123")
    except Exception as e:
        db.session.rollback()
        print(f"[SEED] Note on demo user setup: {e}")


def _seed_destinations_if_empty():
    """Seed destination data from CSV on first launch."""
    from models.destination import Destination
    if Destination.query.count() == 0:
        try:
            import pandas as pd
            csv_path = os.path.join(os.path.dirname(__file__), "..", "dataset", "destinations.csv")
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                for _, row in df.iterrows():
                    dest = Destination(
                        name=str(row.get("name", "")),
                        country=str(row.get("country", "")),
                        city=str(row.get("city", "")),
                        description=str(row.get("description", "")),
                        category=str(row.get("category", "")),
                        climate=str(row.get("climate", "")),
                        budget_level=str(row.get("budget_level", "medium")),
                        activities=str(row.get("activities", "")),
                        best_season=str(row.get("best_season", "")),
                        rating=_clean_float(row.get("rating"), 4.0),
                        image_url=str(row.get("image_url", "")),
                        latitude=_clean_float(row.get("latitude"), 0.0),
                        longitude=_clean_float(row.get("longitude"), 0.0),
                    )
                    db.session.add(dest)
                db.session.commit()
                print(f"[SEED] Loaded {len(df)} destinations from CSV.")
        except Exception as e:
            db.session.rollback()
            print(f"[SEED] Note on destination CSV import: {e}")


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
