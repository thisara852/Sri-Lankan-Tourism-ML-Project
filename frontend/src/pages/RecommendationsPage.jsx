import { useEffect, useState } from 'react'
import api from '../services/api'
import DestinationCard from '../components/DestinationCard'
import { Brain, Loader, RefreshCw, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function RecommendationsPage() {
  const [recs, setRecs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchRecs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/recommendations/?top_n=10')
      setRecs(res.data.recommendations)
    } catch (err) {
      if (err.response?.status === 400) {
        setError('questionnaire')
      } else {
        toast.error('Failed to load recommendations')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecs() }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 20px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(192,132,252,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-glow 2s infinite',
        }}>
          <Brain size={28} color="#818cf8" />
        </div>
        <p style={{ color: 'var(--color-muted)' }}>ML engine is generating your recommendations…</p>
      </div>
    </div>
  )

  if (error === 'questionnaire') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <div className="glass fade-in-up" style={{ borderRadius: '24px', padding: '48px', textAlign: 'center', maxWidth: 420 }}>
        <Settings size={48} color="#f59e0b" style={{ marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '12px' }}>Set Up Your Profile First</h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '28px' }}>
          Complete the travel questionnaire so our ML engine can personalise recommendations for you.
        </p>
        <Link to="/questionnaire"><button className="btn-primary">Take the Questionnaire</button></Link>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(192,132,252,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} color="#818cf8" />
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                Your <span className="gradient-text">Recommendations</span>
              </h1>
            </div>
            <p style={{ color: 'var(--color-muted)' }}>
              Ranked by cosine similarity to your preference profile. Scores shown as match %.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={fetchRecs} style={{ gap: '8px' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <Link to="/questionnaire">
              <button className="btn-secondary"><Settings size={16} /> Edit Profile</button>
            </Link>
          </div>
        </div>

        {recs.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '60px 0' }}>No results yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {recs.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} showScore={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
