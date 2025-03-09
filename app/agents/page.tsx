"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgents, deleteAIAgent } from "@/services/aiagentService"
import { Edit, Trash2, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function Agents() {
  const [agents, setAgents] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const data = await getAIAgents()
      setAgents(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch agents:", err)
      setError("Failed to load agents. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAgent = async (agentId: number) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        setLoading(true)
        await deleteAIAgent(agentId)
        setSuccessMessage("Agent deleted successfully!")
        setTimeout(() => setSuccessMessage(null), 3000)
        await fetchAgents()
      } catch (err) {
        console.error("Failed to delete agent:", err)
        setError("Failed to delete agent. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ProtectedRoute>
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <h1>Your AI Agents</h1>
            <Link href="/create" className="btn btn-primary">
              Create New Agent
            </Link>
          </div>

          {error && (
            <div className="col-12 mb-4">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="col-12 mb-4">
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            </div>
          )}
        </div>

        <div className="row">
          {agents.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">
                You don't have any AI agents yet.{" "}
                <Link href="/create" className="alert-link">
                  Create your first agent
                </Link>
                !
              </div>
            </div>
          ) : (
            agents.map((agent) => (
              <div className="col-md-6 col-lg-4 mb-4" key={agent.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{agent.agent_name}</h5>
                    <div>
                      <Link href={`/agents/${agent.id}`} className="btn btn-sm btn-light me-2" title="View Agent">
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="card-subtitle mb-2 text-muted">Bio</h6>
                      <ul className="list-group list-group-flush">
                        {agent.agent_bio.map((sentence: string, index: number) => (
                          <li key={index} className="list-group-item px-0">
                            {sentence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {agent.traits && agent.traits.length > 0 && (
                      <div className="mb-3">
                        <h6 className="card-subtitle mb-2 text-muted">Traits</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {agent.traits.map((trait: string, index: number) => (
                            <span key={index} className="badge bg-light text-dark border">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.agent_twitter && (
                      <div className="mb-3">
                        <h6 className="card-subtitle mb-2 text-muted">Twitter</h6>
                        <p className="card-text">@{agent.agent_twitter}</p>
                      </div>
                    )}

                    {agent.created_at && (
                      <div className="text-muted small">Created: {new Date(agent.created_at).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <Link href={`/agents/${agent.id}/edit`} className="btn btn-outline-primary btn-sm">
                      <Edit size={16} className="me-1" /> Edit
                    </Link>
                    <Link href={`/agents/${agent.id}/settings`} className="btn btn-outline-secondary btn-sm">
                      <Settings size={16} className="me-1" /> Settings
                    </Link>
                    <button onClick={() => handleDeleteAgent(agent.id)} className="btn btn-outline-danger btn-sm">
                      <Trash2 size={16} className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </ProtectedRoute>
  )
}

