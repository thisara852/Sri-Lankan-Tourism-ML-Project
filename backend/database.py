"""
SQLAlchemy database instance (shared across all models)
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
