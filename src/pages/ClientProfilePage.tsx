import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useNotifications } from "../context/NotificationContext"
import { getClientById, updateClient } from "../services/clientService"
import { updatePolicy } from "../services/policyService"
import { formatCOP, formatDate, getDaysUntilExpiration, getExpirationLabel, getExpirationClass, getClientTenure, getInitials } from "../lib/utils"
import { POLICY_STATUS_LABELS } from "../constants"
import type { ClientWithPolicies } from "../types"

export function ClientProfilePage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const { refresh } = useNotifications()
  const [client, setClient] = useState<ClientWithPolicies | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDoc, setEditDoc] = useState("")
  const [editPhone, setEditPhone] = useState("")

  const loadClient = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    try {
      const data = await getClientById(clientId)
      setClient(data)
      setEditName(data?.full_name ?? "")
      setEditDoc(data?.document_id ?? "")
      setEditPhone(data?.phone ?? "")
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadClient()
  }, [loadClient])

  const handleSaveClient = async () => {
    if (!client) return
    await updateClient(client.id, {
      full_name: editName.trim(),
      document_id: editDoc.trim(),
      phone: editPhone.trim(),
    })
    setEditing(false)
    await loadClient()
  }

  const handlePolicyStatusChange = async (policyId: string, status: string) => {
    await updatePolicy(policyId, { status })
    await loadClient()
    await refresh()
  }

  if (loading) return <div className="loading-state">Cargando perfil...</div>
  if (!client) return <div className="empty-state">Cliente no encontrado</div>

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate(-1)} aria-label="Volver">
        ← Volver
      </button>

      <div className="profile-header">
        <div className="avatar" aria-hidden="true">
          {getInitials(client.full_name)}
        </div>
        <div className="profile-info">
          {editing ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="editName">Nombre completo</label>
                <input id="editName" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="editDoc">Documento</label>
                <input id="editDoc" type="text" value={editDoc} onChange={(e) => setEditDoc(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="editPhone">Teléfono</label>
                <input id="editPhone" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              </div>
              <div className="profile-edit-actions">
                <button className="btn-primary" onClick={handleSaveClient}>Guardar</button>
                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h2>{client.full_name}</h2>
              <div className="profile-meta">
                <span>CC: {client.document_id}</span>
                <span>Tel: {client.phone}</span>
                <span>Cliente hace: {getClientTenure(client.created_at ?? "")}</span>
              </div>
              <button className="btn-secondary btn-small" onClick={() => setEditing(true)}>
                Editar cliente
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-policies">
        <h3>Pólizas ({client.policies?.length ?? 0})</h3>
        {client.policies && client.policies.length > 0 ? (
          <div className="policies-grid">
            {client.policies.map((policy) => {
              const days = getDaysUntilExpiration(policy.expiration_date)
              return (
                <div key={policy.id} className={`policy-card card-${getExpirationClass(days)}`}>
                  <div className="policy-card-header">
                    <span className="policy-type">{policy.policy_type}</span>
                    <select
                      className={`status-select status-${policy.status}`}
                      value={policy.status}
                      onChange={(e) => handlePolicyStatusChange(policy.id, e.target.value)}
                      aria-label="Cambiar estado"
                    >
                      {Object.entries(POLICY_STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="policy-card-body">
                    <div className="policy-detail">
                      <span className="label">Aseguradora</span>
                      <span>{policy.insurer}</span>
                    </div>
                    <div className="policy-detail">
                      <span className="label">Inicio</span>
                      <span>{formatDate(policy.start_date)}</span>
                    </div>
                    <div className="policy-detail">
                      <span className="label">Vencimiento</span>
                      <span>{formatDate(policy.expiration_date)}</span>
                    </div>
                    <div className="policy-detail">
                      <span className="label">Estado</span>
                      <span className={`expiration-label ${getExpirationClass(days)}`}>
                        {getExpirationLabel(days)}
                      </span>
                    </div>
                    <div className="policy-detail">
                      <span className="label">Precio</span>
                      <span className="cell-price">{formatCOP(policy.price)}</span>
                    </div>
                    {policy.notes && (
                      <div className="policy-detail">
                        <span className="label">Notas</span>
                        <span>{policy.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">Este cliente no tiene pólizas registradas</p>
        )}
      </div>
    </div>
  )
}
