import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { useSort } from "../hooks/useSort"
import { SearchBar } from "../components/SearchBar"
import { SortableHeader } from "../components/SortableHeader"
import { CreateClientModal } from "../components/CreateClientModal"
import { getPoliciesByAgent, createClientWithPolicy } from "../services/policyService"
import { formatCOP, formatDate, getDaysUntilExpiration, getExpirationLabel, getExpirationClass } from "../lib/utils"
import { sortPolicies } from "../lib/sortHelpers"
import { POLICY_STATUS_LABELS } from "../constants"
import type { PolicyWithClient, CreateClientWithPolicyData } from "../types"

export function AllPoliciesPage() {
  const { agent } = useAuth()
  const { refresh } = useNotifications()
  const navigate = useNavigate()
  const [policies, setPolicies] = useState<PolicyWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { sortConfig, toggleSort } = useSort()
  const [searchText, setSearchText] = useState("")

  const loadPolicies = useCallback(async () => {
    if (!agent) return
    setLoading(true)
    try {
      const data = await getPoliciesByAgent(agent.id)
      setPolicies(data)
    } finally {
      setLoading(false)
    }
  }, [agent])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPolicies()
  }, [loadPolicies])

  const displayPolicies = useMemo(() => {
    let result = policies
    if (searchText.trim()) {
      const lower = searchText.toLowerCase()
      result = result.filter((p) =>
        p.insurance_clients.full_name.toLowerCase().includes(lower) ||
        p.insurance_clients.document_id.includes(lower) ||
        p.insurance_clients.phone.includes(lower) ||
        p.policy_type.toLowerCase().includes(lower) ||
        p.insurer.toLowerCase().includes(lower)
      )
    }
    if (sortConfig.key && sortConfig.direction) {
      result = sortPolicies(result, sortConfig.key, sortConfig.direction)
    }
    return result
  }, [policies, searchText, sortConfig])

  const handleCreateClient = async (data: CreateClientWithPolicyData) => {
    if (!agent) return
    await createClientWithPolicy(agent.id, data)
    await loadPolicies()
    await refresh()
  }

  if (!agent) return null

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Todas las pólizas</h2>
        <div className="page-actions">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar cliente, documento, póliza..."
          />
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Nuevo cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando pólizas...</div>
      ) : (
        <div className="table-container">
          <table className="data-table" role="grid">
            <thead>
              <tr>
                <SortableHeader label="Nombre" sortKey="full_name" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Documento" sortKey="document_id" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Teléfono" sortKey="phone" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Tipo póliza" sortKey="policy_type" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Aseguradora" sortKey="insurer" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Vencimiento" sortKey="expiration_date" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Estado" sortKey="status" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Inicio" sortKey="start_date" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <SortableHeader label="Precio" sortKey="price" currentKey={sortConfig.key} direction={sortConfig.direction} onSort={toggleSort} />
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {displayPolicies.map((policy) => {
                const days = getDaysUntilExpiration(policy.expiration_date)
                return (
                  <tr
                    key={policy.id}
                    className="table-row-clickable"
                    onClick={() => navigate(`/client/${policy.client_id}`)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/client/${policy.client_id}`)
                    }}
                  >
                    <td className="cell-name">{policy.insurance_clients.full_name}</td>
                    <td>{policy.insurance_clients.document_id}</td>
                    <td>{policy.insurance_clients.phone}</td>
                    <td>{policy.policy_type}</td>
                    <td>{policy.insurer}</td>
                    <td>
                      <div>{formatDate(policy.expiration_date)}</div>
                      <div className={`expiration-label ${getExpirationClass(days)}`}>
                        {getExpirationLabel(days)}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${policy.status}`}>
                        {POLICY_STATUS_LABELS[policy.status] ?? policy.status}
                      </span>
                    </td>
                    <td>{formatDate(policy.start_date)}</td>
                    <td className="cell-price">{formatCOP(policy.price)}</td>
                    <td className="cell-notes" title={policy.notes ?? ""}>
                      {policy.notes ? (policy.notes.length > 30 ? policy.notes.slice(0, 30) + "..." : policy.notes) : "—"}
                    </td>
                  </tr>
                )
              })}
              {displayPolicies.length === 0 && (
                <tr>
                  <td colSpan={10} className="empty-state">
                    {searchText ? "No se encontraron resultados" : "No hay pólizas registradas"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateClientModal
          agentId={agent.id}
          onSubmit={handleCreateClient}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
