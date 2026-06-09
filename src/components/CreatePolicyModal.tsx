import { useState, useEffect, type FormEvent } from "react"
import type { PolicyType, Insurer } from "../types"
import { getInsurers } from "../services/insurerService"
import { POLICY_TYPES } from "../constants"

interface CreatePolicyModalProps {
  clientId: string
  agentId: number
  onSubmit: (data: {
    policy_type: PolicyType
    insurer_id: string
    insurer_name: string
    start_date: string
    expiration_date: string
    price: number
    notes: string
  }) => Promise<void>
  onClose: () => void
}

export function CreatePolicyModal({ onSubmit, onClose }: CreatePolicyModalProps) {
  const [policyType, setPolicyType] = useState<PolicyType>("Automóvil")
  const [insurerId, setInsurerId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [price, setPrice] = useState("")
  const [notes, setNotes] = useState("")
  const [insurers, setInsurers] = useState<Insurer[]>([])
  const [loadingInsurers, setLoadingInsurers] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadInsurers() {
      try {
        const data = await getInsurers()
        setInsurers(data)
        if (data.length > 0) setInsurerId(data[0].id)
      } finally {
        setLoadingInsurers(false)
      }
    }
    loadInsurers()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const insurer = insurers.find((i) => i.id === insurerId)
    if (!insurer) return

    setSubmitting(true)
    try {
      await onSubmit({
        policy_type: policyType,
        insurer_id: insurerId,
        insurer_name: insurer.name,
        start_date: startDate,
        expiration_date: expirationDate,
        price: parseFloat(price),
        notes: notes.trim(),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Crear nueva póliza">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva póliza</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="policyType">Tipo de póliza</label>
              <select
                id="policyType"
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                required
              >
                {POLICY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="insurer">Aseguradora</label>
              <select
                id="insurer"
                value={insurerId}
                onChange={(e) => setInsurerId(e.target.value)}
                required
                disabled={loadingInsurers}
              >
                {insurers.map((insurer) => (
                  <option key={insurer.id} value={insurer.id}>{insurer.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha de inicio</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expirationDate">Fecha de vencimiento</label>
              <input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio (COP)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 1500000"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notas del asesor</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Observaciones opcionales..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting || loadingInsurers}>
              {submitting ? "Creando..." : "Crear póliza"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
