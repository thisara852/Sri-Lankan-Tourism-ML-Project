import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowRight, ArrowLeft, Loader, CheckCircle } from 'lucide-react'

const STEPS = [
  {
    id: 'travel_style',
    title: "What's your travel style?",
    subtitle: 'Pick the one that resonates most.',
    field: 'travel_style',
    type: 'single',
    options: [
      { value: 'adventure',   label: '🧗 Adventure',  desc: 'Hiking, extreme sports, wilderness' },
      { value: 'cultural',    label: '🏛️ Cultural',   desc: 'History, museums, local traditions' },
      { value: 'beach',       label: '🏖️ Beach',      desc: 'Sun, sand, water sports' },
      { value: 'city',        label: '🏙️ City Break',  desc: 'Urban life, food, nightlife' },
      { value: 'wildlife',    label: '🦁 Wildlife',   desc: 'Safari, nature, bird watching' },
    ],
  },
  {
    id: 'budget',
    title: "What's your budget range?",
    subtitle: 'Be honest — there are great options at every level.',
    field: 'budget_preference',
    type: 'single',
    options: [
      { value: 'budget',  label: '💰 Budget',  desc: 'Hostels, street food, local transport' },
      { value: 'medium',  label: '💳 Mid-range', desc: 'Comfortable hotels, mix of dining' },
      { value: 'luxury',  label: '✨ Luxury',  desc: 'Premium stays, fine dining, exclusive experiences' },
    ],
  },
  {
    id: 'climate',
    title: 'Preferred climate?',
    subtitle: 'Pick your ideal weather conditions.',
    field: 'climate_pref',
    type: 'single',
    options: [
      { value: 'tropical',      label: '☀️ Tropical',      desc: 'Hot & humid, lush greenery' },
      { value: 'temperate',     label: '🌤️ Temperate',     desc: 'Mild seasons, pleasant year-round' },
      { value: 'cold',          label: '❄️ Cold',           desc: 'Snow, ice, dramatic landscapes' },
      { value: 'arid',          label: '🏜️ Arid / Desert',  desc: 'Dry heat, vast open spaces' },
      { value: 'mediterranean', label: '🫒 Mediterranean',  desc: 'Warm summers, mild winters' },
    ],
  },
  {
    id: 'activities',
    title: 'What activities do you love?',
    subtitle: 'Select all that apply.',
    field: 'preferred_activities',
    type: 'multi',
    options: [
      'hiking', 'surfing', 'diving', 'snorkeling', 'museums', 'art',
      'food', 'wine', 'shopping', 'photography', 'wildlife', 'safari',
      'yoga', 'temples', 'history', 'sailing', 'skiing', 'cycling',
      'camping', 'trekking',
    ],
  },
  {
    id: 'group',
    title: 'Who are you travelling with?',
    subtitle: 'This helps tailor activity recommendations.',
    field: 'group_type',
    type: 'single',
    options: [
      { value: 'solo',   label: '🧍 Solo',     desc: 'Freedom and self-discovery' },
      { value: 'couple', label: '👫 Couple',   desc: 'Romantic getaways' },
      { value: 'family', label: '👨‍👩‍👧‍👦 Family',  desc: 'Kid-friendly adventures' },
      { value: 'group',  label: '👥 Group',    desc: 'Friends on the road' },
    ],
  },
]

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState({
    travel_style: '', budget_preference: '', climate_pref: '',
    preferred_activities: [], group_type: '', trip_duration: 7,
  })

  const current = STEPS[step]
  const progress = ((step) / STEPS.length) * 100

  const selectSingle = (field, val) => setAnswers((a) => ({ ...a, [field]: val }))
  const toggleMulti  = (field, val) => setAnswers((a) => {
    const arr = a[field] || []
    return { ...a, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] }
  })

  const canNext = () => {
    if (current.type === 'single') return !!answers[current.field]
    if (current.type === 'multi')  return (answers[current.field] || []).length > 0
    return true
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      try {
        await api.post('/questionnaire/', answers)
        toast.success('Profile saved! Generating your recommendations…')
        navigate('/recommendations')
      } catch (err) {
        toast.error('Failed to save profile')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 640, padding: '0 24px' }}>
        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="glass fade-in-up" style={{ borderRadius: '24px', padding: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{current.title}</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>{current.subtitle}</p>

          {/* Single select */}
          {current.type === 'single' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {current.options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => selectSingle(current.field, opt.value)}
                  style={{
                    padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
                    border: `1px solid ${answers[current.field] === opt.value ? 'rgba(99,102,241,0.6)' : 'var(--color-border)'}`,
                    background: answers[current.field] === opt.value ? 'rgba(99,102,241,0.12)' : 'var(--color-surface2)',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                    {opt.desc && <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{opt.desc}</div>}
                  </div>
                  {answers[current.field] === opt.value && <CheckCircle size={20} color="#818cf8" />}
                </div>
              ))}
            </div>
          )}

          {/* Multi select */}
          {current.type === 'multi' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {current.options.map((opt) => (
                <button
                  key={opt}
                  className={`chip ${(answers[current.field] || []).includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleMulti(current.field, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '12px' }}>
            {step > 0 ? (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}
            <button className="btn-primary" onClick={handleNext} disabled={!canNext() || loading}>
              {loading ? <><Loader size={16} className="animate-spin" /> Saving…</> :
               step === STEPS.length - 1 ? <>Finish & Get Recommendations <ArrowRight size={16} /></> : <>Next <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
