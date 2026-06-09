import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useNotifications } from "../context/NotificationContext"
import { useSort } from "../hooks/useSort"
import { SearchBar } from "../components/SearchBar"
import { SortableHeader } from "../components/SortableHeader"
import { updatePolicy } from "../services/policyService"
import { formatCOP, formatDate, getDaysUntilExpiration, getExpirationLabel, getExpirationClass } from "../lib/utils"
import { sortPolicies } from "../lib/sortHelpers"
import { POLICY_STATUS_LABELS, EXPIRING_FILTER_OPTIONS } from "../constants"
import type { PolicyWithClient, ExpiringFilter } from "../types"

function filterByExpiration(policies: PolicyWithClient[], filter: ExpiringFilter): PolicyWithClient[] {
  if (filter === "all") return policies
  return policies.filter((p) => {
    const days = getDaysUntilExpiration(p.expiration_date)
    switch (filter) {
      case "less_30":
        return days >= 0 && days <= 30
      case "less_15":
        return days >= 0 && days <= 15
      case "less_5":
        return days >= 0 && days <= 5
      case "expired_5":
        return days < 0 && days >= -5
      case "expired_20":
        return days < -5
      default:
        return true
    }
  })
}

export function ExpiringPoliciesPage() {
  const { expiringPolicies, refresh } = useNotifications()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ExpiringFilter>("all")
  const [searchText, setSearchText] = useState("")
  const { sortConfig, toggleSort } = useSort("full_name", "asc")
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState("")

  const displayPolicies = useMemo(() => {
    let result = filterByExpiration(expiringPolicies, filter)
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
  }, [expiringPolicies, filter, searchText, sortConfig])

  const handleStatusChange = useCallback(async (policyId: string, newStatus: string) => {
    await updatePolicy(policyId, { status: newStatus })
    await refresh()
  }, [refresh])

  const handleSaveNotes = useCallback(async (policyId: string) => {
    await updatePolicy(policyId, { notes: noteValue })
    setEditingNotes(null)
    await refresh()
  }, [noteValue, refresh])

  const startEditingNotes = useCallback((policy: PolicyWithClient) => {
    setEditingNotes(policy.id)
    setNoteValue(policy.notes ?? "")
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Pólizas por vencer / Vencidas</h2>
        <div className="page-actions">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar cliente..."
          />
        </div>
      </div>

      <div className="filter-bar" role="group" aria-label="Filtrar por tiempo de vencimiento">
        {EXPIRING_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-btn ${filter === opt.value ? "active" : ""}`}
            onClick={() => setFilter(opt.value as ExpiringFilter)}
            aria-pressed={filter === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

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
                  className={`table-row-clickable row-${getExpirationClass(days)}`}
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`status-select status-${policy.status}`}
                      value={policy.status}
                      onChange={(e) => handleStatusChange(policy.id, e.target.value)}
                      aria-label="Cambiar estado de póliza"
                    >
                      {Object.entries(POLICY_STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(policy.start_date)}</td>
                  <td className="cell-price">{formatCOP(policy.price)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {editingNotes === policy.id ? (
                      <div className="notes-editor">
                        <textarea
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          rows={2}
                          autoFocus
                        />
                        <div className="notes-actions">
                          <button className="btn-small btn-primary" onClick={() => handleSaveNotes(policy.id)}>Guardar</button>
                          <button className="btn-small btn-secondary" onClick={() => setEditingNotes(null)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="notes-display"
                        onClick={() => startEditingNotes(policy)}
                        title="Click para editar notas"
                      >
                        {policy.notes || "Agregar nota..."}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {displayPolicies.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-state">
                  No hay pólizas que coincidan con el filtro
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
