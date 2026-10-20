import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import Navbar               from './components/Navbar'
import LandingPage          from './pages/LandingPage'
import LoginPage            from './pages/LoginPage'
import RegisterPage         from './pages/RegisterPage'
import QuestionnairePage    from './pages/QuestionnairePage'
import DashboardPage        from './pages/DashboardPage'
import RecommendationsPage  from './pages/RecommendationsPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import ItineraryPage        from './pages/ItineraryPage'
import ProfilePage          from './pages/ProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        <Route path="/questionnaire"    element={<ProtectedRoute><QuestionnairePage /></ProtectedRoute>} />
        <Route path="/dashboard"        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/recommendations"  element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        <Route path="/destination/:id"  element={<ProtectedRoute><DestinationDetailPage /></ProtectedRoute>} />
        <Route path="/itinerary"        element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
        <Route path="/profile"          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a2235',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          },
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
