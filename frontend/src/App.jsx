import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import CommunityTemplates from './pages/CommunityTemplates'
import APIPlayground from './pages/APIPlayground'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import Layout from './components/Layout'

// All pages are fully public — auth gate is triggered only on endpoint creation
export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo_client_id'}>
      <AuthProvider>
        <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/signup"     element={<Signup />} />
            <Route path="/pricing"    element={<Pricing />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/analytics"  element={<AnalyticsDashboard />} />
            <Route path="/templates"  element={<CommunityTemplates />} />
            <Route path="/playground" element={<APIPlayground />} />
            <Route path="*"           element={<LandingPage />} />
          </Routes>
        </Layout>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
