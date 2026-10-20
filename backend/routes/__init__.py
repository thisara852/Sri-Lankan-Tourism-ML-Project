# routes package
from .auth import auth_bp
from .destinations import destinations_bp
from .recommendations import recommendations_bp
from .questionnaire import questionnaire_bp
from .itinerary import itinerary_bp
from .behaviour import behaviour_bp

__all__ = [
    "auth_bp", "destinations_bp", "recommendations_bp",
    "questionnaire_bp", "itinerary_bp", "behaviour_bp",
]
