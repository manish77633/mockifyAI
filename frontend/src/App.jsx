import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import CommunityTemplates from './pages/CommunityTemplates'
import APIPlayground from './pages/APIPlayground'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import Layout from './components/Layout'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // No longer wrapping in Layout here, as it's handled globally in App()
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><CommunityTemplates /></ProtectedRoute>} />
            <Route path="/playground" element={<ProtectedRoute><APIPlayground /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
