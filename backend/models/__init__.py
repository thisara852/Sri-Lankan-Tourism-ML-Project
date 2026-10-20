# models package — import all models so SQLAlchemy picks them up
from .user import User
from .user_profile import UserProfile
from .destination import Destination
from .itinerary import Itinerary
from .behaviour import UserBehaviour

__all__ = ["User", "UserProfile", "Destination", "Itinerary", "UserBehaviour"]
