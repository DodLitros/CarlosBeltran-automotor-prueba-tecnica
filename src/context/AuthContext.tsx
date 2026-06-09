import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Agent } from "../types"
import { getAgentById } from "../services/agentService"

interface AuthContextType {
  agent: Agent | null
  loading: boolean
  login: (agentId: number) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (agentId: number) => {
    setLoading(true)
    try {
      const data = await getAgentById(agentId)
      if (!data) throw new Error("Agente no encontrado")
      setAgent(data)
      localStorage.setItem("agent_id", String(agentId))
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setAgent(null)
    localStorage.removeItem("agent_id")
  }, [])

  return (
    <AuthContext.Provider value={{ agent, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
