import { useEffect, useState } from 'react'
import api from '../services/api'
import { Plus, Calendar, Trash2, Loader, MapPin, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading]         = useState(true)
  const [creating, setCreating]       = useState(false)
  const [form, setForm]               = useState({ title: '', start_date: '', end_date: '', notes: '' })

  const fetchItineraries = async () => {
    try {
      const res = await api.get('/itinerary/')
      setItineraries(res.data.itineraries)
    } catch { toast.error('Failed to load itineraries') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchItineraries() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/itinerary/', form)
      setItineraries([res.data.itinerary, ...itineraries])
      setCreating(false)
      setForm({ title: '', start_date: '', end_date: '', notes: '' })
      toast.success('Itinerary created!')
    } catch { toast.error('Failed to create itinerary') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this itinerary?')) return
    try {
      await api.delete(`/itinerary/${id}`)
      setItineraries(itineraries.filter((i) => i.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '6px' }}>
              My <span className="gradient-text">Itineraries</span>
            </h1>
            <p style={{ color: 'var(--color-muted)' }}>Plan and organise your dream trips</p>
          </div>
          <button className="btn-primary" onClick={() => setCreating(!creating)}>
            <Plus size={16} /> New Itinerary
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="glass fade-in-up" style={{ borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '24px' }}>Create New Itinerary</h3>
            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label className="label">Trip Title</label>
                <input className="input" placeholder="e.g. Bali Adventure 2025" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input className="input" type="date" value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input className="input" type="date" value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label className="label">Notes</label>
                <textarea className="input" rows={3} placeholder="Any initial plans or notes…"
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ resize: 'vertical' }} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : itineraries.length === 0 ? (
          <div className="glass" style={{ borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
            <Calendar size={48} color="var(--color-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '8px' }}>No itineraries yet</h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>Create your first trip plan to get started.</p>
            <button className="btn-primary" onClick={() => setCreating(true)}><Plus size={16} /> Create Itinerary</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {itineraries.map((itin) => (
              <div key={itin.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', flex: 1, marginRight: '12px' }}>{itin.title}</h3>
                  <button className="btn-icon" onClick={() => handleDelete(itin.id)} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
                {itin.start_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: '0.82rem', marginBottom: '8px' }}>
                    <Calendar size={13} />
                    <span>{itin.start_date} → {itin.end_date || '?'}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
                  <MapPin size={13} />
                  <span>{itin.destinations.length} destination{itin.destinations.length !== 1 ? 's' : ''}</span>
                </div>
                {itin.notes && (
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.83rem', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {itin.notes}
                  </p>
                )}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  Created {new Date(itin.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
