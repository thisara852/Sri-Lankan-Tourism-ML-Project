# 🌍 SmartTourism — AI-Powered Travel Recommendation System

A full-stack web application that uses **Content-Based Filtering** and **Cosine Similarity** (ML) to recommend personalised travel destinations based on user preferences and behaviour.

---

## 🏗️ Tech Stack

| Layer    | Technology                                |
|----------|-------------------------------------------|
| Frontend | React.js + Vite + Tailwind CSS v4         |
| Backend  | Python + Flask + SQLAlchemy               |
| Database | SQLite (local dev) → PostgreSQL (prod)    |
| ML       | Pandas + NumPy + Scikit-learn             |
| Auth     | JWT (Flask-JWT-Extended)                  |

---

## 📁 Project Structure

```
smart-tourism/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/   Navbar, DestinationCard
│       ├── contexts/     AuthContext
│       ├── pages/        All page components
│       └── services/     Axios API client
│
├── backend/           # Flask REST API
│   ├── app.py            Entry point
│   ├── database.py       SQLAlchemy instance
│   ├── models/           ORM models
│   ├── routes/           API blueprints
│   └── ml/               Recommendation engine
│
└── dataset/
    └── destinations.csv  25 seed destinations
```

---

## 🚀 Day 1 — Running Locally

### Backend

```powershell
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
py app.py
```

Backend runs at **http://localhost:5000**

### Frontend

```powershell
cd frontend
npm run dev
```

Frontend runs at **http://localhost:3000**

---

## 🤖 ML Architecture

```
User Questionnaire
       ↓
Travel Preference Profile
  • travel_style (category)
  • budget_preference
  • climate_pref
  • preferred_activities (multi-label)
       ↓
Feature Vector (one-hot + multi-hot)
       ↓
Cosine Similarity vs all destinations
       ↓
Ranked Recommendations (top 10)
       ↓
Behavioural Feedback (click/fav/search)
       ↓
Better future recommendations
```

---

## 📡 API Endpoints

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/api/auth/register`              | Create account                  |
| POST   | `/api/auth/login`                 | Login & get JWT                 |
| GET    | `/api/auth/me`                    | Current user info               |
| GET    | `/api/destinations/`              | List/search destinations        |
| GET    | `/api/destinations/:id`           | Destination detail              |
| POST   | `/api/questionnaire/`             | Save preference profile         |
| GET    | `/api/recommendations/`           | Get ML recommendations          |
| POST   | `/api/behaviour/track`            | Log user event                  |
| GET    | `/api/itinerary/`                 | List user itineraries           |
| POST   | `/api/itinerary/`                 | Create itinerary                |
| DELETE | `/api/itinerary/:id`              | Delete itinerary                |

---

## 📅 10-Day Roadmap

| Day | Goal |
|-----|------|
| 1   | ✅ Project structure, backend, frontend scaffold |
| 2   | Destination detail, itinerary builder |
| 3   | ML model tuning + behavioural weighting |
| 4   | Admin panel for dataset management |
| 5   | Polish UI, mobile responsiveness |
| 6   | Testing (Jest + Pytest) |
| 7   | Performance optimisation |
| 8   | Deployment (Vercel + Render) |
| 9   | Documentation |
| 10  | Final review & demo |
