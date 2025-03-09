"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgent } from "@/services/aiagentService"
import { ArrowLeft, Edit, Settings, Twitter, Key } from "lucide-react"
import Link from "next/link"

export default function AgentDetail({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const agentId = Number.parseInt(params.id)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        const data = await getAIAgent(agentId)
        setAgent(data)
        setError(null)
      } catch (err) {
        console.error(`Failed to fetch agent ${agentId}:`, err)
        setError("Failed to load agent details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !agent) {
    return (
      <ProtectedRoute>
          <div className="alert alert-danger" role="alert">
            {error || "Failed to load agent details. Please try again later."}
          </div>
          <button onClick={() => router.back()} className="btn btn-primary">
            <ArrowLeft size={16} className="me-2" /> Go Back
          </button>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
        <div className="mb-4">
          <button onClick={() => router.back()} className="btn btn-outline-secondary mb-3">
            <ArrowLeft size={16} className="me-2" /> Back to Agents
          </button>

          <div className="d-flex justify-content-between align-items-center">
            <h1>{agent.agent_name}</h1>
            <div>
              <Link href={`/agents/${agent.id}/edit`} className="btn btn-outline-primary me-2">
                <Edit size={16} className="me-1" /> Edit Agent
              </Link>
              <Link href={`/agents/${agent.id}/settings`} className="btn btn-outline-secondary">
                <Settings size={16} className="me-1" /> API Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Agent Bio</h5>
              </div>
              <div className="card-body">
                {agent.agent_bio.map((sentence: string, index: number) => (
                  <p key={index} className="mb-2">
                    {sentence}
                  </p>
                ))}
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Traits</h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  {agent.traits.map((trait: string, index: number) => (
                    <span key={index} className="badge bg-light text-dark border p-2">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {agent.agent_twitter && (
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center">
                  <Twitter size={18} className="me-2 text-primary" />
                  <h5 className="mb-0">Twitter</h5>
                </div>
                <div className="card-body">
                  <p className="mb-0">
                    <a
                      href={`https://twitter.com/${agent.agent_twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      @{agent.agent_twitter}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center">
                <Key size={18} className="me-2 text-primary" />
                <h5 className="mb-0">API Keys</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {Object.entries(agent)
                    .filter(
                      ([key, value]) =>
                        (key.includes("api_key") || key.includes("token") || key.includes("private_key")) &&
                        value &&
                        typeof value === "string",
                    )
                    .map(([key, value]) => (
                      <li key={key} className="list-group-item px-0 d-flex justify-content-between">
                        <span className="text-capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="text-muted">•••••••••••••</span>
                      </li>
                    ))}
                </ul>
                <div className="mt-3">
                  <Link href={`/agents/${agent.id}/settings`} className="btn btn-outline-primary btn-sm w-100">
                    <Settings size={16} className="me-1" /> Manage API Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Agent Details</h5>
              </div>
              <div className="card-body">
                {agent.created_at && (
                  <p className="mb-2">
                    <strong>Created:</strong> {new Date(agent.created_at).toLocaleDateString()}
                  </p>
                )}
                <p className="mb-2">
                  <strong>ID:</strong> {agent.id}
                </p>
              </div>
            </div>
          </div>
        </div>
    </ProtectedRoute>
  )
}

