from database import db
import json


class Destination(db.Model):
    """A travel destination with all feature vectors used by the ML model."""

    __tablename__ = "destinations"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(120), nullable=False)
    country     = db.Column(db.String(80), nullable=False)
    city        = db.Column(db.String(80))
    description = db.Column(db.Text)

    # Feature columns (used by ML model)
    category    = db.Column(db.String(50))    # beach, mountain, city, cultural, wildlife
    climate     = db.Column(db.String(50))    # tropical, cold, temperate, arid, mediterranean
    budget_level= db.Column(db.String(20))    # budget, medium, luxury
    activities  = db.Column(db.Text)          # JSON list: hiking, surfing, museums, etc.
    best_season = db.Column(db.String(50))    # spring, summer, autumn, winter, year-round

    # Meta
    rating      = db.Column(db.Float, default=4.0)
    image_url   = db.Column(db.String(500))
    latitude    = db.Column(db.Float)
    longitude   = db.Column(db.Float)

    def get_activities(self):
        try:
            return json.loads(self.activities or "[]")
        except Exception:
            return []

    def to_dict(self):
        return {
            "id":           self.id,
            "name":         self.name,
            "country":      self.country,
            "city":         self.city,
            "description":  self.description,
            "category":     self.category,
            "climate":      self.climate,
            "budget_level": self.budget_level,
            "activities":   self.get_activities(),
            "best_season":  self.best_season,
            "rating":       self.rating,
            "image_url":    self.image_url,
            "latitude":     self.latitude,
            "longitude":    self.longitude,
        }
