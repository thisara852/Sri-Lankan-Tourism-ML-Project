import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Brain, MapPin, Star, Zap } from 'lucide-react'

const features = [
  { icon: Brain,  title: 'AI Recommendations',   desc: 'Content-based ML engine learns your travel personality.' },
  { icon: Globe,  title: 'Global Destinations',   desc: '25+ curated destinations across every continent.' },
  { icon: Zap,    title: 'Behaviour Learning',     desc: 'Every click, search, and save refines your profile.' },
  { icon: MapPin, title: 'Smart Itineraries',      desc: 'Build and save personalised day-by-day travel plans.' },
]

export default function LandingPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-primary fade-in-up" style={{ marginBottom: '24px', fontSize: '0.8rem' }}>
            ✨ AI-Powered Travel Intelligence
          </div>
          <h1 className="fade-in-up" style={{ animationDelay: '0.1s', fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '24px', lineHeight: 1.1 }}>
            Discover Your Perfect
            <br />
            <span className="gradient-text">Travel Destination</span>
          </h1>
          <p className="fade-in-up" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-muted)',
            maxWidth: 560, margin: '0 auto 40px', animationDelay: '0.2s',
          }}>
            Our machine learning engine analyses your preferences and behaviour to
            recommend destinations you'll genuinely love — not just popular ones.
          </p>
          <div className="fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
            <Link to="/register">
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Start Exploring <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="fade-in-up" style={{
            display: 'flex', gap: '48px', justifyContent: 'center',
            marginTop: '72px', animationDelay: '0.4s',
          }}>
            {[['25+', 'Destinations'], ['5', 'Continents'], ['ML', 'Powered'], ['Free', 'To Use']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#818cf8' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '12px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p style={{ color: 'var(--color-muted)', maxWidth: 480, margin: '0 auto' }}>
              Built on cosine similarity and content-based filtering — the same ML foundations used by Netflix and Spotify.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '32px 24px' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(192,132,252,0.1))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <Icon size={24} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
