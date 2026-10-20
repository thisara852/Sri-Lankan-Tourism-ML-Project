from database import db
from datetime import datetime, timezone


class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username      = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    profile        = db.relationship("UserProfile",    back_populates="user", uselist=False, cascade="all, delete-orphan")
    itineraries    = db.relationship("Itinerary",      back_populates="user", cascade="all, delete-orphan")
    behaviours     = db.relationship("UserBehaviour",  back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":         self.id,
            "email":      self.email,
            "username":   self.username,
            "created_at": self.created_at.isoformat(),
        }
