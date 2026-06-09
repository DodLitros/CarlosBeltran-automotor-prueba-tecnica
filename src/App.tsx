import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import { Layout } from "./components/Layout"
import { LoginPage } from "./pages/LoginPage"
import { AllPoliciesPage } from "./pages/AllPoliciesPage"
import { ExpiringPoliciesPage } from "./pages/ExpiringPoliciesPage"
import { ClientProfilePage } from "./pages/ClientProfilePage"
import "./styles/global.css"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { agent } = useAuth()
  if (!agent) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { agent, login } = useAuth()

  useEffect(() => {
    const savedId = localStorage.getItem("agent_id")
    if (savedId && !agent) {
      login(parseInt(savedId, 10)).catch(() => {
        localStorage.removeItem("agent_id")
      })
    }
  }, [agent, login])

  return (
    <Routes>
      <Route path="/" element={agent ? <Navigate to="/policies" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NotificationProvider>
              <Layout />
            </NotificationProvider>
          </ProtectedRoute>
        }
      >
        <Route path="policies" element={<AllPoliciesPage />} />
        <Route path="expiring" element={<ExpiringPoliciesPage />} />
        <Route path="client/:clientId" element={<ClientProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
