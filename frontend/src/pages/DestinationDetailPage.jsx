import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { MapPin, Star, Globe, Sun, DollarSign, Calendar, ArrowLeft, Plus, Loader, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_EMOJI = {
  beach: '🏖️', mountain: '⛰️', cultural: '🏛️',
  wildlife: '🦁', city: '🏙️', adventure: '🧗',
}

export default function DestinationDetailPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [dest, setDest]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [faved, setFaved]     = useState(false)

  useEffect(() => {
    api.get(`/destinations/${id}`)
      .then((res) => setDest(res.data.destination))
      .catch(() => toast.error('Destination not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleFav = () => {
    setFaved(!faved)
    api.post('/behaviour/track', { event_type: 'favourite', destination_id: Number(id) }).catch(() => {})
    toast.success(faved ? 'Removed from favourites' : 'Added to favourites!')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <Loader size={32} className="animate-spin" color="var(--color-primary)" />
    </div>
  )
  if (!dest) return null

  const catColor = { beach: '#f59e0b', cultural: '#8b5cf6', wildlife: '#ef4444', city: '#3b82f6', adventure: '#f97316' }[dest.category] || '#6366f1'

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      {/* Hero banner */}
      <div style={{
        height: 320,
        background: `linear-gradient(135deg, ${catColor}22, rgba(99,102,241,0.15))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '8rem', position: 'relative',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span>{CATEGORY_EMOJI[dest.category] || '📍'}</span>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 50%)' }} />
      </div>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {/* Back button */}
        <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px' }}>{dest.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)' }}>
                  <MapPin size={16} />
                  <span>{dest.city ? `${dest.city}, ` : ''}{dest.country}</span>
                </div>
              </div>
              <button onClick={handleFav} style={{
                width: 48, height: 48, borderRadius: '50%',
                background: faved ? 'rgba(239,68,68,0.1)' : 'var(--color-surface2)',
                border: `1px solid ${faved ? 'rgba(239,68,68,0.5)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <Heart size={20} fill={faved ? '#ef4444' : 'none'} color={faved ? '#ef4444' : 'var(--color-muted)'} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <span className="badge badge-primary">{dest.category}</span>
              <span className="badge badge-accent">{dest.climate}</span>
              <span className="badge badge-success">{dest.best_season}</span>
            </div>

            <p style={{ color: 'var(--color-muted)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '32px' }}>
              {dest.description}
            </p>

            {/* Activities */}
            {dest.activities?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Popular Activities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {dest.activities.map((act) => (
                    <span key={act} className="chip selected" style={{ cursor: 'default' }}>{act}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — info card */}
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.05rem' }}>Destination Info</h3>
            {[
              { icon: Star,       label: 'Rating',        val: `${dest.rating?.toFixed(1)} / 5.0` },
              { icon: DollarSign, label: 'Budget Level',  val: dest.budget_level },
              { icon: Sun,        label: 'Best Season',   val: dest.best_season },
              { icon: Globe,      label: 'Climate',       val: dest.climate },
              { icon: MapPin,     label: 'Country',       val: dest.country },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{val}</div>
                </div>
              </div>
            ))}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
              onClick={() => navigate('/itinerary')}>
              <Plus size={16} /> Add to Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
