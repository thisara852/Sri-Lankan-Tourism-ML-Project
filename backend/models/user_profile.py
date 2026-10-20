from database import db
from datetime import datetime, timezone
import json


class UserProfile(db.Model):
    """Stores the user's travel preference profile derived from the questionnaire."""

    __tablename__ = "user_profiles"

    id                = db.Column(db.Integer, primary_key=True)
    user_id           = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)

    # Preferences (from questionnaire)
    travel_style      = db.Column(db.String(50))        # adventure, cultural, relaxation, luxury
    budget_preference = db.Column(db.String(20))        # budget, medium, luxury
    climate_pref      = db.Column(db.String(50))        # tropical, cold, temperate, arid
    preferred_activities = db.Column(db.Text)           # JSON list
    group_type        = db.Column(db.String(30))        # solo, couple, family, group
    trip_duration     = db.Column(db.Integer)           # days
    accessibility_needs = db.Column(db.Boolean, default=False)

    # Favourite destinations (JSON list of destination IDs)
    favourites        = db.Column(db.Text, default="[]")

    updated_at        = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                                  onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="profile")

    def get_activities(self):
        try:
            return json.loads(self.preferred_activities or "[]")
        except Exception:
            return []

    def get_favourites(self):
        try:
            return json.loads(self.favourites or "[]")
        except Exception:
            return []

    def to_dict(self):
        return {
            "id":                    self.id,
            "user_id":               self.user_id,
            "travel_style":          self.travel_style,
            "budget_preference":     self.budget_preference,
            "climate_pref":          self.climate_pref,
            "preferred_activities":  self.get_activities(),
            "group_type":            self.group_type,
            "trip_duration":         self.trip_duration,
            "accessibility_needs":   self.accessibility_needs,
            "favourites":            self.get_favourites(),
            "updated_at":            self.updated_at.isoformat() if self.updated_at else None,
        }
