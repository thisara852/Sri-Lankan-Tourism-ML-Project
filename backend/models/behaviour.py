from database import db
from datetime import datetime, timezone


class UserBehaviour(db.Model):
    """
    Tracks every meaningful user interaction:
      - search  : user searched for a term
      - click   : user viewed a destination detail
      - favourite: user saved a destination
      - rate    : user rated a destination
    These events feed the behavioural profile used to improve recommendations.
    """

    __tablename__ = "user_behaviours"

    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    event_type     = db.Column(db.String(20), nullable=False)   # search | click | favourite | rate
    destination_id = db.Column(db.Integer, db.ForeignKey("destinations.id"), nullable=True)
    search_query   = db.Column(db.String(200))
    rating_given   = db.Column(db.Float)
    timestamp      = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user        = db.relationship("User", back_populates="behaviours")
    destination = db.relationship("Destination")

    def to_dict(self):
        return {
            "id":             self.id,
            "user_id":        self.user_id,
            "event_type":     self.event_type,
            "destination_id": self.destination_id,
            "search_query":   self.search_query,
            "rating_given":   self.rating_given,
            "timestamp":      self.timestamp.isoformat(),
        }
