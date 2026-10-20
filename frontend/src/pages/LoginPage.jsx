import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: '64px',
      background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%)',
    }}>
      <div className="glass fade-in-up" style={{ width: '100%', maxWidth: 420, borderRadius: '24px', padding: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        {/* Quick Demo Credentials Helper */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '24px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary-h)' }}>🔑 Demo Account</span>
            <button
              type="button"
              onClick={() => setForm({ email: 'demo', password: 'password123' })}
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Auto-fill
            </button>
          </div>
          <div style={{ color: 'var(--color-muted)', lineHeight: '1.4' }}>
            Username: <strong style={{ color: '#fff' }}>demo</strong> (or <span style={{ color: '#fff' }}>demo@tourism.com</span>)<br />
            Password: <strong style={{ color: '#fff' }}>password123</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input id="login-email" className="input" type="text" placeholder="demo or you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input id="login-password" className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <button id="login-submit" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {loading ? <><Loader size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-muted)', fontSize: '0.88rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary-h)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
