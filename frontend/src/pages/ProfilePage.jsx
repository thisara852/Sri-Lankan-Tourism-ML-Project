import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { User, Settings, Activity, Heart, Calendar, Edit3, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user }                  = useAuth()
  const [profile, setProfile]     = useState(null)
  const [behaviours, setBehaviours] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/questionnaire/').catch(() => ({ data: { profile: null } })),
      api.get('/behaviour/history').catch(() => ({ data: { events: [] } })),
    ]).then(([profRes, behRes]) => {
      setProfile(profRes.data.profile)
      setBehaviours(behRes.data.events)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <Loader size={32} className="animate-spin" color="var(--color-primary)" />
    </div>
  )

  const clickCount   = behaviours.filter((b) => b.event_type === 'click').length
  const favCount     = behaviours.filter((b) => b.event_type === 'favourite').length
  const searchCount  = behaviours.filter((b) => b.event_type === 'search').length

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '32px' }}>
          My <span className="gradient-text">Profile</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* User card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #6366f1, #c084fc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit',
                color: 'white',
              }}>
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{user?.username}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>

            {/* Activity stats */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.78rem', fontWeight: 600 }}>
                Behaviour Stats
              </h3>
              {[
                { label: 'Destinations Viewed', val: clickCount },
                { label: 'Favourited',           val: favCount },
                { label: 'Searches',             val: searchCount },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#818cf8' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel profile */}
          <div>
            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Travel Preference Profile</h3>
                <Link to="/questionnaire">
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                </Link>
              </div>

              {!profile?.travel_style ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-muted)' }}>
                  <Settings size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ marginBottom: '16px' }}>No profile yet</p>
                  <Link to="/questionnaire"><button className="btn-primary">Take Questionnaire</button></Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Travel Style',  val: profile.travel_style },
                    { label: 'Budget',        val: profile.budget_preference },
                    { label: 'Climate',       val: profile.climate_pref },
                    { label: 'Group Type',    val: profile.group_type },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ padding: '16px', background: 'var(--color-surface2)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
                      <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{val || '—'}</div>
                    </div>
                  ))}
                  {profile.preferred_activities?.length > 0 && (
                    <div style={{ gridColumn: '1/-1', padding: '16px', background: 'var(--color-surface2)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Activities</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {profile.preferred_activities.map((act) => (
                          <span key={act} className="badge badge-primary">{act}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Recent Activity</h3>
              {behaviours.slice(0, 8).length === 0 ? (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>No activity yet. Start exploring!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {behaviours.slice(0, 8).map((ev) => (
                    <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: 'var(--color-surface2)' }}>
                      <span style={{ fontSize: '1rem' }}>
                        {ev.event_type === 'click' ? '👁️' : ev.event_type === 'favourite' ? '❤️' : ev.event_type === 'search' ? '🔍' : '⭐'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{ev.event_type}</span>
                        {ev.search_query && <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}> — "{ev.search_query}"</span>}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                        {new Date(ev.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
