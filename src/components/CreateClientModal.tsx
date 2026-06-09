import { useState, type FormEvent } from "react"
import type { InsuranceClientInsert } from "../types"

interface CreateClientModalProps {
  agentId: number
  onSubmit: (client: InsuranceClientInsert) => Promise<void>
  onClose: () => void
}

export function CreateClientModal({ agentId, onSubmit, onClose }: CreateClientModalProps) {
  const [fullName, setFullName] = useState("")
  const [documentId, setDocumentId] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        agent_id: agentId,
        full_name: fullName.trim(),
        document_id: documentId.trim(),
        phone: phone.trim(),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Crear nuevo cliente">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo cliente</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="documentId">Documento de identidad</label>
            <input
              id="documentId"
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creando..." : "Crear cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
