import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import type { PolicyWithClient } from "../types"
import { getExpiringPolicies, getExpiringCount } from "../services/policyService"
import { useAuth } from "./AuthContext"

interface NotificationContextType {
  expiringPolicies: PolicyWithClient[]
  expiringCount: number
  loading: boolean
  refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { agent } = useAuth()
  const [expiringPolicies, setExpiringPolicies] = useState<PolicyWithClient[]>([])
  const [expiringCount, setExpiringCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  const refresh = useCallback(async () => {
    if (!agent) return
    setLoading(true)
    try {
      const [policies, count] = await Promise.all([
        getExpiringPolicies(agent.id),
        getExpiringCount(agent.id),
      ])
      setExpiringPolicies(policies)
      setExpiringCount(count)
    } finally {
      setLoading(false)
    }
  }, [agent])

  useEffect(() => {
    if (agent && !initialized.current) {
      initialized.current = true
      refresh()
    }
  }, [agent, refresh])

  return (
    <NotificationContext.Provider
      value={{ expiringPolicies, expiringCount, loading, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider")
  return ctx
}
