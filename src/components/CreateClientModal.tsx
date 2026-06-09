import { useState, useEffect, type FormEvent } from "react"
import type { PolicyType, Insurer, CreateClientWithPolicyData } from "../types"
import { getInsurers } from "../services/insurerService"
import { POLICY_TYPES } from "../constants"

interface CreateClientModalProps {
  agentId: number
  onSubmit: (data: CreateClientWithPolicyData) => Promise<void>
  onClose: () => void
}

export function CreateClientModal({ onSubmit, onClose }: CreateClientModalProps) {
  const [fullName, setFullName] = useState("")
  const [documentId, setDocumentId] = useState("")
  const [phone, setPhone] = useState("")
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
        client: {
          full_name: fullName.trim(),
          document_id: documentId.trim(),
          phone: phone.trim(),
        },
        policy: {
          policy_type: policyType,
          insurer_id: insurerId,
          insurer_name: insurer.name,
          start_date: startDate,
          expiration_date: expirationDate,
          price: parseFloat(price),
          notes: notes.trim(),
        },
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Crear nuevo cliente con póliza">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo cliente y póliza</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <fieldset className="form-section">
            <legend>Datos del cliente</legend>
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
          </fieldset>

          <fieldset className="form-section">
            <legend>Datos de la póliza</legend>
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
          </fieldset>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting || loadingInsurers}>
              {submitting ? "Creando..." : "Crear cliente y póliza"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
