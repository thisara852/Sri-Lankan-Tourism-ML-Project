import { MapPin, Star, Heart } from 'lucide-react'
import api from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORY_COLORS = {
  beach:    '#f59e0b',
  mountain: '#10b981',
  cultural: '#8b5cf6',
  wildlife: '#ef4444',
  city:     '#3b82f6',
  adventure:'#f97316',
}

const CATEGORY_EMOJI = {
  beach: '🏖️', mountain: '⛰️', cultural: '🏛️',
  wildlife: '🦁', city: '🏙️', adventure: '🧗',
}

export default function DestinationCard({ destination, showScore = false }) {
  const navigate = useNavigate()
  const [faved, setFaved] = useState(false)

  const catColor = CATEGORY_COLORS[destination.category] || '#6366f1'
  const catEmoji = CATEGORY_EMOJI[destination.category] || '📍'

  const handleClick = () => {
    // Track click event (fire and forget)
    api.post('/behaviour/track', { event_type: 'click', destination_id: destination.id }).catch(() => {})
    navigate(`/destination/${destination.id}`)
  }

  const handleFav = (e) => {
    e.stopPropagation()
    setFaved(!faved)
    api.post('/behaviour/track', { event_type: 'favourite', destination_id: destination.id }).catch(() => {})
  }

  return (
    <div className="card fade-in-up" style={{ cursor: 'pointer' }} onClick={handleClick}>
      {/* Image / Placeholder */}
      <div style={{
        height: 200,
        background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '4rem', position: 'relative',
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
      }}>
        <span>{catEmoji}</span>
        {/* Favourite button */}
        <button
          onClick={handleFav}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <Heart size={16} fill={faved ? '#ef4444' : 'none'} color={faved ? '#ef4444' : '#94a3b8'} />
        </button>
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '3px 10px', borderRadius: '99px',
          background: `${catColor}25`, border: `1px solid ${catColor}55`,
          color: catColor, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
        }}>
          {destination.category}
        </div>
        {/* Similarity score (if shown in recommendations) */}
        {showScore && destination.similarity_score !== undefined && (
          <div className="score-ring" style={{ position: 'absolute', bottom: 12, right: 12 }}>
            {Math.round(destination.similarity_score * 100)}%
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Title & location */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{destination.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)', fontSize: '0.82rem', marginBottom: '10px' }}>
          <MapPin size={12} />
          <span>{destination.city ? `${destination.city}, ` : ''}{destination.country}</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.83rem', color: 'var(--color-muted)', lineHeight: '1.5', marginBottom: '12px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {destination.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{destination.rating?.toFixed(1)}</span>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: '99px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
          }}>
            {destination.budget_level}
          </span>
        </div>
      </div>
    </div>
  )
}
