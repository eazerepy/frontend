"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgents, deleteAIAgent } from "@/services/aiagentService"
import { Edit, Trash2, Settings, ExternalLink, Plus } from "lucide-react"
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
        <div className="min-h-screen bg-gray-50 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Your AI Agents</h1>
              <Link
                href="/create"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md flex items-center"
              >
                <Plus size={18} className="mr-2" /> Create New Agent
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6" role="alert">
                {successMessage}
              </div>
            )}

            {agents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 mb-4">You don't have any AI agents yet.</p>
                <Link
                  href="/create"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Create your first agent
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-white">{agent.agent_name}</h2>
                      <Link
                        href={`/agents/${agent.id}`}
                        className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                        title="View Agent"
                      >
                        <ExternalLink size={16} className="text-white" />
                      </Link>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                        <ul className="space-y-1">
                          {agent.agent_bio.map((sentence: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm">
                              {sentence}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {agent.traits && agent.traits.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.traits.map((trait: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.agent_twitter && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Twitter</h3>
                          <p className="text-gray-700">@{agent.agent_twitter}</p>
                        </div>
                      )}

                      {agent.created_at && (
                        <div className="text-xs text-gray-500 mt-4">
                          Created: {new Date(agent.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                      <Link
                        href={`/agents/${agent.id}/edit`}
                        className="px-3 py-1 bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 rounded text-sm font-medium flex items-center"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Link>
                      <Link
                        href={`/agents/${agent.id}/settings`}
                        className="px-3 py-1 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded text-sm font-medium flex items-center"
                      >
                        <Settings size={14} className="mr-1" /> Settings
                      </Link>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="px-3 py-1 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded text-sm font-medium flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </ProtectedRoute>
  )
}

