import { useState, useEffect, type FormEvent } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const { login, loading, agent } = useAuth()
  const navigate = useNavigate()
  const [agentId, setAgentId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (agent) navigate("/policies")
  }, [agent, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    const id = parseInt(agentId, 10)
    if (isNaN(id) || id < 1) {
      setError("Ingrese un número de agente válido")
      return
    }
    try {
      await login(id)
    } catch {
      setError("Agente no encontrado. Intente con 1, 2 o 3.")
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>SegurosPro</h1>
          <p>Sistema de gestión de pólizas</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="agentId">Identificación de agente</label>
            <input
              id="agentId"
              type="number"
              min="1"
              max="999"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Ej: 1, 2, 3"
              required
              autoFocus
              autoComplete="off"
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="login-hint">
          <p>Agentes de prueba: <strong>1</strong>, <strong>2</strong>, <strong>3</strong></p>
        </div>
      </div>
    </div>
  )
}
