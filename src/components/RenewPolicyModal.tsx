import { useState, useEffect, type FormEvent } from "react"
import type { Policy, PolicyRenewal } from "../types"
import { getRenewalsByPolicyId } from "../services/renewalService"
import { formatDate, formatCOP } from "../lib/utils"

interface RenewPolicyModalProps {
  policy: Policy
  onSubmit: (data: {
    new_expiration_date: string
    new_price: number
  }) => Promise<void>
  onClose: () => void
}

function calculateDefaultExpiration(policy: Policy): string {
  const startDate = new Date(policy.start_date)
  const expDate = new Date(policy.expiration_date)
  const durationMs = expDate.getTime() - startDate.getTime()
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))
  
  const today = new Date()
  const newExpDate = new Date(today)
  newExpDate.setDate(newExpDate.getDate() + durationDays)
  
  return newExpDate.toISOString().split("T")[0]
}

export function RenewPolicyModal({ policy, onSubmit, onClose }: RenewPolicyModalProps) {
  const [newExpirationDate, setNewExpirationDate] = useState(() => calculateDefaultExpiration(policy))
  const [newPrice, setNewPrice] = useState(String(policy.price))
  const [renewals, setRenewals] = useState<PolicyRenewal[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getRenewalsByPolicyId(policy.id).then(setRenewals)
  }, [policy.id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        new_expiration_date: newExpirationDate,
        new_price: parseFloat(newPrice),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Renovar póliza">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Renovar póliza</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="renewal-info">
            <div className="info-row">
              <span className="label">Póliza actual:</span>
              <span>{policy.policy_type} - {policy.insurer}</span>
            </div>
            <div className="info-row">
              <span className="label">Vencimiento anterior:</span>
              <span>{formatDate(policy.expiration_date)}</span>
            </div>
            <div className="info-row">
              <span className="label">Precio anterior:</span>
              <span>{formatCOP(policy.price)}</span>
            </div>
          </div>

          <fieldset className="form-section">
            <legend>Nueva renovación</legend>
            <div className="form-group">
              <label htmlFor="newExpirationDate">Nueva fecha de vencimiento</label>
              <input
                id="newExpirationDate"
                type="date"
                value={newExpirationDate}
                onChange={(e) => setNewExpirationDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPrice">Nuevo precio (COP)</label>
              <input
                id="newPrice"
                type="number"
                min="0"
                step="1000"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
              />
            </div>
          </fieldset>

          {renewals.length > 0 && (
            <div className="renewal-history">
              <h4>Historial de renovaciones</h4>
              <div className="renewal-list">
                {renewals.map((renewal) => (
                  <div key={renewal.id} className="renewal-item">
                    <div className="renewal-date">
                      {formatDate(renewal.renewed_at ?? "")}
                    </div>
                    <div className="renewal-details">
                      <span>De {formatDate(renewal.previous_expiration_date)} a {formatDate(renewal.new_expiration_date)}</span>
                      <span>{formatCOP(renewal.previous_price)} → {formatCOP(renewal.new_price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Renovando..." : "Confirmar renovación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
