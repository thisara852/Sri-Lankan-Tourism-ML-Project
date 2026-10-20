import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Compass, Heart, Calendar, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { to: '/dashboard',       label: 'Discover',    icon: Compass },
  { to: '/recommendations', label: 'For You',      icon: Heart },
  { to: '/itinerary',       label: 'Itineraries',  icon: Calendar },
  { to: '/profile',         label: 'Profile',      icon: User },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #c084fc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
            <span className="gradient-text">Smart</span>Tourism
          </span>
        </Link>

        {/* Desktop links */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to} to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
                  color: location.pathname === to ? '#818cf8' : '#94a3b8',
                  background: location.pathname === to ? 'rgba(99,102,241,0.15)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={16} />{label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <div style={{
                padding: '6px 14px', background: 'rgba(99,102,241,0.1)',
                borderRadius: '99px', border: '1px solid rgba(99,102,241,0.3)',
                fontSize: '0.85rem', color: '#818cf8', fontWeight: 600,
              }}>
                {user.username}
              </div>
              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-secondary" style={{ padding: '8px 20px' }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '8px 20px' }}>Get Started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
