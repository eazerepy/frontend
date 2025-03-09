"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgent, type AIAgent } from "@/services/aiagentService"
import { ArrowLeft, Edit, Settings, Twitter, Key, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AgentDetail({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<AIAgent | null>(null)
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
      } catch (err: any) {
        console.error(`Failed to fetch agent ${agentId}:`, err)
        // Check if it's a 404 error (agent not found or not owned by user)
        if (err.response && err.response.status === 404) {
          setError("Agent not found or you don't have permission to view it.")
        } else {
          setError("Failed to load agent details. Please try again later.")
        }
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
          <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                {error || "Failed to load agent details. Please try again later."}
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" /> Go Back
              </button>
            </div>
          </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm flex items-center mb-4"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Agents
              </button>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">{agent.agent_name}</h1>
                  <div className="flex space-x-3">
                    <Link
                      href={`/agents/${agent.id}/edit`}
                      className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md flex items-center transition-colors"
                    >
                      <Edit size={16} className="mr-2" /> Edit Agent
                    </Link>
                    <Link
                      href={`/agents/${agent.id}/settings`}
                      className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md flex items-center transition-colors"
                    >
                      <Settings size={16} className="mr-2" /> API Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">Agent Bio</h2>
                  </div>
                  <div className="p-4">
                    {agent.agent_bio.map((sentence: string, index: number) => (
                      <p key={index} className="mb-3 text-gray-700">
                        {sentence}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">Traits</h2>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.traits.map((trait: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {agent.agent_twitter && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center">
                      <Twitter size={18} className="mr-2 text-white" />
                      <h2 className="text-lg font-semibold text-white">Twitter</h2>
                    </div>
                    <div className="p-4">
                      <a
                        href={`https://twitter.com/${agent.agent_twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center"
                      >
                        @{agent.agent_twitter}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center">
                    <Key size={18} className="mr-2 text-white" />
                    <h2 className="text-lg font-semibold text-white">API Keys</h2>
                  </div>
                  <div className="p-4">
                    <ul className="divide-y divide-gray-100">
                      {Object.entries(agent)
                        .filter(
                          ([key, value]) =>
                            (key.includes("api_key") || key.includes("token") || key.includes("private_key")) &&
                            value &&
                            typeof value === "string",
                        )
                        .map(([key, value]) => (
                          <li key={key} className="py-2 flex justify-between items-center">
                            <span className="text-sm text-gray-700 capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="text-sm text-gray-500">•••••••••••••</span>
                          </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                      <Link
                        href={`/agents/${agent.id}/settings`}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-center font-medium rounded-md shadow-sm flex items-center justify-center"
                      >
                        <Settings size={16} className="mr-2" /> Manage API Settings
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">Agent Details</h2>
                  </div>
                  <div className="p-4">
                    {agent.created_at && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Created</span>
                        <span className="text-sm text-gray-700">{new Date(agent.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="text-sm font-medium text-gray-600">ID</span>
                      <span className="text-sm text-gray-700">{agent.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </ProtectedRoute>
  )
}

