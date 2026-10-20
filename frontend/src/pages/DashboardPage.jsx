import { useEffect, useState } from 'react'
import api from '../services/api'
import DestinationCard from '../components/DestinationCard'
import { Search, Filter, Loader, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'beach', 'cultural', 'adventure', 'city', 'wildlife']
const BUDGETS    = ['All', 'budget', 'medium', 'luxury']

export default function DashboardPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [category, setCategory]         = useState('All')
  const [budget, setBudget]             = useState('All')
  const [page, setPage]                 = useState(1)
  const [total, setTotal]               = useState(0)

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, per_page: 12 })
      if (search)              params.set('q', search)
      if (category !== 'All') params.set('category', category)
      if (budget !== 'All')   params.set('budget', budget)
      const res = await api.get(`/destinations/?${params}`)
      setDestinations(res.data.destinations)
      setTotal(res.data.total)
    } catch {
      toast.error('Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDestinations() }, [search, category, budget, page])

  // Track search in behaviour API
  const handleSearch = (val) => {
    setSearch(val)
    if (val.length > 2) {
      api.post('/behaviour/track', { event_type: 'search', search_query: val }).catch(() => {})
    }
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '8px' }}>
            Discover <span className="gradient-text">Destinations</span>
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>Explore {total} curated destinations worldwide</p>
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input
              id="dashboard-search"
              className="input"
              placeholder="Search destinations, countries…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`chip ${category === cat ? 'selected' : ''}`}
              onClick={() => { setCategory(cat); setPage(1) }}>
              {cat === 'All' ? '🌍 All' : cat}
            </button>
          ))}
        </div>

        {/* Budget chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {BUDGETS.map((b) => (
            <button key={b} className={`chip ${budget === b ? 'selected' : ''}`}
              onClick={() => { setBudget(b); setPage(1) }}>
              {b === 'All' ? '💳 Any Budget' : b}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-muted)' }}>
            <Globe size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p>No destinations found. Try different filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
