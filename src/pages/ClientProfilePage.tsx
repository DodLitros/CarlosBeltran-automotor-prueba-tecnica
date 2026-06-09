import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { getClientById, updateClient } from "../services/clientService"
import { updatePolicy, createPolicy } from "../services/policyService"
import { createRenewal } from "../services/renewalService"
import { CreatePolicyModal } from "../components/CreatePolicyModal"
import { RenewPolicyModal } from "../components/RenewPolicyModal"
import { formatCOP, formatDate, getDaysUntilExpiration, getExpirationLabel, getExpirationClass, getClientTenure, getInitials } from "../lib/utils"
import { POLICY_STATUS_LABELS } from "../constants"
import type { ClientWithPolicies, Policy, PolicyType } from "../types"

function canRenewPolicy(policy: Policy): boolean {
  const days = getDaysUntilExpiration(policy.expiration_date)
  return days >= -30
}

function canChangeToEnGestion(policy: Policy): boolean {
  const days = getDaysUntilExpiration(policy.expiration_date)
  return days >= -30
}

export function ClientProfilePage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const { agent } = useAuth()
  const { refresh } = useNotifications()
  const [client, setClient] = useState<ClientWithPolicies | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDoc, setEditDoc] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [showCreatePolicy, setShowCreatePolicy] = useState(false)
  const [renewingPolicy, setRenewingPolicy] = useState<Policy | null>(null)

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

  const handlePolicyStatusChange = async (policy: Policy, status: string) => {
    if (status === "en_gestion" && !canChangeToEnGestion(policy)) {
      alert("No se puede cambiar a 'En gestión' porque la póliza está vencida por más de 30 días")
      return
    }
    await updatePolicy(policy.id, { status })
    await loadClient()
    await refresh()
  }

  const handleCreatePolicy = async (data: {
    policy_type: PolicyType
    insurer_id: string
    insurer_name: string
    start_date: string
    expiration_date: string
    price: number
    notes: string
  }) => {
    if (!client || !agent) return
    await createPolicy({
      agent_id: agent.id,
      client_id: client.id,
      policy_type: data.policy_type,
      insurer: data.insurer_name,
      insurer_id: data.insurer_id,
      start_date: data.start_date,
      expiration_date: data.expiration_date,
      price: data.price,
      status: "vigente",
      notes: data.notes,
    })
    await loadClient()
    await refresh()
  }

  const handleRenewPolicy = async (data: {
    new_expiration_date: string
    new_price: number
  }) => {
    if (!renewingPolicy || !agent) return
    
    await createRenewal({
      policy_id: renewingPolicy.id,
      previous_expiration_date: renewingPolicy.expiration_date,
      new_expiration_date: data.new_expiration_date,
      previous_price: renewingPolicy.price,
      new_price: data.new_price,
      renewed_by: agent.id,
    })
    
    await updatePolicy(renewingPolicy.id, {
      start_date: renewingPolicy.expiration_date,
      expiration_date: data.new_expiration_date,
      price: data.new_price,
      status: "vigente",
    })
    
    setRenewingPolicy(null)
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
        <div className="section-header">
          <h3>Pólizas ({client.policies?.length ?? 0})</h3>
          <button className="btn-primary btn-small" onClick={() => setShowCreatePolicy(true)}>
            + Nueva póliza
          </button>
        </div>
        {client.policies && client.policies.length > 0 ? (
          <div className="policies-grid">
            {client.policies.map((policy) => {
              const days = getDaysUntilExpiration(policy.expiration_date)
              const canRenew = canRenewPolicy(policy)
              const canEnGestion = canChangeToEnGestion(policy)
              
              return (
                <div key={policy.id} className={`policy-card card-${getExpirationClass(days)}`}>
                  <div className="policy-card-header">
                    <span className="policy-type">{policy.policy_type}</span>
                    <select
                      className={`status-select status-${policy.status}`}
                      value={policy.status}
                      onChange={(e) => handlePolicyStatusChange(policy, e.target.value)}
                      aria-label="Cambiar estado"
                    >
                      {Object.entries(POLICY_STATUS_LABELS).map(([val, label]) => {
                        const isDisabled = val === "en_gestion" && !canEnGestion
                        return (
                          <option key={val} value={val} disabled={isDisabled}>
                            {label} {isDisabled ? "(No disponible)" : ""}
                          </option>
                        )
                      })}
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
                    <div className="policy-actions">
                      <button
                        className="btn-renew"
                        onClick={() => setRenewingPolicy(policy)}
                        disabled={!canRenew}
                        title={canRenew ? "Renovar póliza" : "No se puede renovar: vencida por más de 30 días"}
                      >
                        Renovar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="empty-state">Este cliente no tiene pólizas registradas</p>
        )}
      </div>

      {showCreatePolicy && agent && (
        <CreatePolicyModal
          clientId={client.id}
          agentId={agent.id}
          onSubmit={handleCreatePolicy}
          onClose={() => setShowCreatePolicy(false)}
        />
      )}

      {renewingPolicy && (
        <RenewPolicyModal
          policy={renewingPolicy}
          onSubmit={handleRenewPolicy}
          onClose={() => setRenewingPolicy(null)}
        />
      )}
    </div>
  )
}
