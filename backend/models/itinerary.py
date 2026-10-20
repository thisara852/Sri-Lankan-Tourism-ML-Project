from database import db
from datetime import datetime, timezone
import json


class Itinerary(db.Model):
    """A saved travel itinerary belonging to a user."""

    __tablename__ = "itineraries"

    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title         = db.Column(db.String(150), nullable=False)
    start_date    = db.Column(db.Date)
    end_date      = db.Column(db.Date)
    destinations  = db.Column(db.Text, default="[]")   # JSON list of destination IDs
    activities    = db.Column(db.Text, default="[]")   # JSON list of planned activities
    notes         = db.Column(db.Text)
    is_public     = db.Column(db.Boolean, default=False)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="itineraries")

    def get_destinations(self):
        try:
            return json.loads(self.destinations or "[]")
        except Exception:
            return []

    def get_activities(self):
        try:
            return json.loads(self.activities or "[]")
        except Exception:
            return []

    def to_dict(self):
        return {
            "id":           self.id,
            "user_id":      self.user_id,
            "title":        self.title,
            "start_date":   self.start_date.isoformat() if self.start_date else None,
            "end_date":     self.end_date.isoformat() if self.end_date else None,
            "destinations": self.get_destinations(),
            "activities":   self.get_activities(),
            "notes":        self.notes,
            "is_public":    self.is_public,
            "created_at":   self.created_at.isoformat(),
        }
