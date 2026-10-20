"""
Content-Based Recommendation Engine
====================================
Strategy:
  1. Build a feature vector for every destination (category, climate, budget, activities).
  2. Build a feature vector for the current user profile.
  3. Compute Cosine Similarity between user vector and all destination vectors.
  4. Rank destinations by similarity score and return the top-N.

The feature matrix is rebuilt lazily and cached in-process.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity

from models.destination import Destination

# ── In-process cache ──────────────────────────────────────────────────────────
_cache: dict = {}


def _build_feature_matrix(destinations: list[Destination]):
    """
    Convert a list of Destination ORM objects into a numeric feature matrix.

    Columns:
      - One-hot: category, climate, budget_level
      - Multi-hot: activities (top-30 most common)
    """
    records = [
        {
            "id":           d.id,
            "category":     d.category or "unknown",
            "climate":      d.climate or "unknown",
            "budget_level": d.budget_level or "medium",
            "activities":   d.get_activities(),
        }
        for d in destinations
    ]
    df = pd.DataFrame(records)

    # One-hot encode categorical features
    cat_dummies     = pd.get_dummies(df["category"],     prefix="cat")
    climate_dummies = pd.get_dummies(df["climate"],      prefix="clim")
    budget_dummies  = pd.get_dummies(df["budget_level"], prefix="bud")

    # Multi-hot encode activities
    mlb = MultiLabelBinarizer()
    activity_matrix = pd.DataFrame(
        mlb.fit_transform(df["activities"]),
        columns=[f"act_{a}" for a in mlb.classes_],
    )

    feature_df = pd.concat(
        [cat_dummies, climate_dummies, budget_dummies, activity_matrix],
        axis=1,
    )

    return feature_df, mlb


def _build_user_vector(profile, feature_columns: list[str], mlb: MultiLabelBinarizer) -> np.ndarray:
    """
    Build a user feature vector with the same columns as the destination matrix.
    """
    vec = np.zeros(len(feature_columns))
    col_index = {col: i for i, col in enumerate(feature_columns)}

    # category / travel_style
    cat_col = f"cat_{profile.travel_style}"
    if cat_col in col_index:
        vec[col_index[cat_col]] = 1.0

    # climate
    clim_col = f"clim_{profile.climate_pref}"
    if clim_col in col_index:
        vec[col_index[clim_col]] = 1.0

    # budget
    bud_col = f"bud_{profile.budget_preference}"
    if bud_col in col_index:
        vec[col_index[bud_col]] = 1.0

    # activities (multi-hot)
    user_activities = profile.get_activities()
    for activity in user_activities:
        act_col = f"act_{activity}"
        if act_col in col_index:
            vec[col_index[act_col]] = 1.0

    return vec.reshape(1, -1)


def get_recommendations(profile, top_n: int = 10) -> list[dict]:
    """
    Public entry point — returns a list of destination dicts ranked by similarity.
    """
    from flask import current_app

    # Reload destinations (could also cache with a TTL)
    destinations = Destination.query.all()
    if not destinations:
        return []

    feature_df, mlb = _build_feature_matrix(destinations)
    destination_matrix = feature_df.values.astype(float)
    feature_columns    = list(feature_df.columns)

    user_vec = _build_user_vector(profile, feature_columns, mlb)

    # Cosine similarity: shape (1, N)
    scores = cosine_similarity(user_vec, destination_matrix)[0]

    # Attach scores and sort
    results = []
    for dest, score in zip(destinations, scores):
        d = dest.to_dict()
        d["similarity_score"] = round(float(score), 4)
        results.append(d)

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_n]
