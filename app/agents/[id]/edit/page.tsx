"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgent, updateAIAgent, type AIAgent } from "@/services/aiagentService"
import { ArrowLeft, Save, PlusCircle, X, Twitter, User, FileText, Tag, Key } from "lucide-react"
import Link from "next/link"

export default function EditAgent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const agentId = Number.parseInt(params.id)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Agent basic info
  const [agentName, setAgentName] = useState("")
  const [bioSentence, setBioSentence] = useState("")
  const [agentBio, setAgentBio] = useState<string[]>([])
  const [agentTwitter, setAgentTwitter] = useState("")
  const [trait, setTrait] = useState("")
  const [traits, setTraits] = useState<string[]>([])
  const [showTraitSuggestions, setShowTraitSuggestions] = useState(false)

  // API Keys
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // Sample trait suggestions
  const traitSuggestions = [
    "Analytical",
    "Creative",
    "Detail-oriented",
    "Empathetic",
    "Strategic",
    "Technical",
    "Persuasive",
    "Resourceful",
  ]

  // API key groups
  const apiKeyGroups = [
    {
      title: "AI Models",
      keys: [
        { name: "allora_api_key", label: "Allora API Key" },
        { name: "anthropic_api_key", label: "Anthropic API Key" },
        { name: "openai_api_key", label: "OpenAI API Key" },
        { name: "groq_api_key", label: "Groq API Key" },
        { name: "xai_api_key", label: "XAI API Key" },
        { name: "together_api_key", label: "Together API Key" },
        { name: "hyperbolic_api_key", label: "Hyperbolic API Key" },
        { name: "galadriel_api_key", label: "Galadriel API Key" },
        { name: "galadriel_fine_tune_api_key", label: "Galadriel Fine Tune API Key" },
        { name: "eternalai_api_key", label: "Eternal AI API Key" },
        { name: "eternalai_api_url", label: "Eternal AI API URL" },
      ],
    },
    {
      title: "Blockchain",
      keys: [
        { name: "evm_private_key", label: "EVM Private Key" },
        { name: "solana_private_key", label: "Solana Private Key" },
        { name: "sonic_private_key", label: "Sonic Private Key" },
        { name: "goat_rpc_provider_url", label: "Goat RPC Provider URL" },
        { name: "goat_wallet_private_key", label: "Goat Wallet Private Key" },
        { name: "monad_private_key", label: "Monad Private Key" },
      ],
    },
    {
      title: "Social Media",
      keys: [
        { name: "farcaster_mnemonic", label: "Farcaster Mnemonic" },
        { name: "twitter_consumer_key", label: "Twitter Consumer Key" },
        { name: "twitter_consumer_secret", label: "Twitter Consumer Secret" },
        { name: "twitter_access_token", label: "Twitter Access Token" },
        { name: "twitter_access_token_secret", label: "Twitter Access Token Secret" },
        { name: "twitter_user_id", label: "Twitter User ID" },
        { name: "twitter_bearer_token", label: "Twitter Bearer Token" },
        { name: "discord_token", label: "Discord Token" },
      ],
    },
  ]

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        const agent = await getAIAgent(agentId)

        // Set basic info
        setAgentName(agent.agent_name)
        setAgentBio(agent.agent_bio || [])
        setAgentTwitter(agent.agent_twitter || "")
        setTraits(agent.traits || [])

        // Set API keys
        const keys: Record<string, string> = {}
        apiKeyGroups.forEach((group) => {
          group.keys.forEach((key) => {
            const keyName = key.name
            if (agent[keyName as keyof AIAgent]) {
              keys[keyName] = agent[keyName as keyof AIAgent] as string
            } else {
              keys[keyName] = ""
            }
          })
        })
        setApiKeys(keys)

        // Set all groups expanded by default
        const initialExpandedState: Record<string, boolean> = {}
        apiKeyGroups.forEach((group) => {
          initialExpandedState[group.title] = true
        })
        setExpandedGroups(initialExpandedState)

        setError(null)
      } catch (err: any) {
        console.error(`Failed to fetch agent ${agentId}:`, err)
        // Check if it's a 404 error (agent not found or not owned by user)
        if (err.response && err.response.status === 404) {
          setError("Agent not found or you don't have permission to edit it.")
        } else {
          setError("Failed to load agent details. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  // Bio sentence handlers
  const handleAddBioSentence = () => {
    if (bioSentence.trim() !== "") {
      setAgentBio([...agentBio, bioSentence.trim()])
      setBioSentence("")
    }
  }

  const handleRemoveBioSentence = (index: number) => {
    setAgentBio(agentBio.filter((_, i) => i !== index))
  }

  // Trait handlers
  const handleAddTrait = () => {
    if (trait.trim() !== "" && !traits.includes(trait.trim())) {
      setTraits([...traits, trait.trim()])
      setTrait("")
      setShowTraitSuggestions(false)
    }
  }

  const handleRemoveTrait = (traitToRemove: string) => {
    setTraits(traits.filter((t) => t !== traitToRemove))
  }

  const handleSelectSuggestion = (suggestion: string) => {
    if (!traits.includes(suggestion)) {
      setTraits([...traits, suggestion])
    }
    setShowTraitSuggestions(false)
  }

  // API key handlers
  const handleInputChange = (keyName: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [keyName]: value,
    }))
  }

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }))
  }

  // Key press handlers
  const handleBioKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddBioSentence()
    }
  }

  const handleTraitKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTrait()
    }
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (agentBio.length === 0) {
      setError("Please add at least one sentence to the agent bio.")
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Prepare agent data
      const agentData: Partial<AIAgent> = {
        agent_name: agentName,
        agent_bio: agentBio,
        agent_twitter: agentTwitter,
        traits: traits,
        ...apiKeys,
      }

      // Update agent
      await updateAIAgent(agentId, agentData)

      setSuccessMessage("Agent updated successfully!")
      setTimeout(() => {
        router.push(`/agents/${agentId}`)
      }, 1500)
    } catch (err) {
      console.error("Failed to update agent:", err)
      setError("Failed to update agent. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
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
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 text-white">
                <h1 className="text-2xl font-bold">Edit Agent: {agentName}</h1>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6"
                role="alert"
              >
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                      <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Agent Name */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <User className="mr-2 h-5 w-5 text-purple-600" />
                          Agent Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Enter agent name"
                          required
                        />
                      </div>

                      {/* Agent Bio */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FileText className="mr-2 h-5 w-5 text-purple-600" />
                          Agent Bio
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-grow px-4 py-3 rounded-l-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            value={bioSentence}
                            onChange={(e) => setBioSentence(e.target.value)}
                            onKeyPress={handleBioKeyPress}
                            placeholder="Add a sentence to the bio (press Enter or click +)"
                          />
                          <button
                            type="button"
                            onClick={handleAddBioSentence}
                            className="px-4 py-3 rounded-r-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                          >
                            <PlusCircle className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Display added bio sentences */}
                        {agentBio.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-500">Added sentences:</p>
                            <div className="space-y-2">
                              {agentBio.map((sentence, index) => (
                                <div
                                  key={index}
                                  className="flex items-start bg-gray-100 rounded-md p-3 border border-gray-200"
                                >
                                  <p className="flex-grow text-gray-700">{sentence}</p>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBioSentence(index)}
                                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                                    aria-label="Remove sentence"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-500 flex justify-between">
                          <span>{bioSentence.length} characters in current sentence</span>
                          <span>{agentBio.length}/3 sentences</span>
                        </p>
                      </div>

                      {/* Agent Traits */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Tag className="mr-2 h-5 w-5 text-purple-600" />
                          Agent Traits
                        </label>
                        <div className="relative">
                          <div className="flex">
                            <input
                              type="text"
                              className="flex-grow px-4 py-3 rounded-l-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                              value={trait}
                              onChange={(e) => setTrait(e.target.value)}
                              onKeyPress={handleTraitKeyPress}
                              onFocus={() => setShowTraitSuggestions(true)}
                              onBlur={() => {
                                setTimeout(() => setShowTraitSuggestions(false), 200)
                              }}
                              placeholder="Add a trait (press Enter or click +)"
                            />
                            <button
                              type="button"
                              onClick={handleAddTrait}
                              className="px-4 py-3 rounded-r-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                            >
                              <PlusCircle className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Trait suggestions */}
                          {showTraitSuggestions && (
                            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                              <div className="py-1">
                                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                                  Suggested Traits
                                </div>
                                {traitSuggestions.map((suggestion) => (
                                  <div
                                    key={suggestion}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className={`px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                                      traits.includes(suggestion) ? "opacity-50" : ""
                                    }`}
                                  >
                                    {suggestion}
                                    {traits.includes(suggestion) && " (added)"}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Display selected traits */}
                        {traits.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-2">Added traits:</p>
                            <div className="flex flex-wrap gap-2">
                              {traits.map((t) => (
                                <div
                                  key={t}
                                  className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200"
                                >
                                  {t}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTrait(t)}
                                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                                    aria-label="Remove trait"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-500">{traits.length} traits added</p>
                      </div>

                      {/* Agent Twitter */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Twitter className="mr-2 h-5 w-5 text-purple-600" />
                          Agent Twitter
                        </label>
                        <div className="flex">
                          <div className="flex items-center px-4 bg-gray-100 border-y border-l border-gray-300 rounded-l-md text-gray-500">
                            @
                          </div>
                          <input
                            type="text"
                            className="flex-grow px-4 py-3 rounded-r-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            value={agentTwitter}
                            onChange={(e) => setAgentTwitter(e.target.value)}
                            placeholder="twitter_handle"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center">
                      <Key className="mr-2 h-5 w-5 text-white" />
                      <h2 className="text-lg font-semibold text-white">API Keys</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-4">
                        Configure the API keys needed for your agent to interact with various services.
                      </p>

                      {apiKeyGroups.map((group) => (
                        <div key={group.title} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.title)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium text-gray-800">{group.title}</span>
                            <span className="text-gray-500">{expandedGroups[group.title] ? "−" : "+"}</span>
                          </button>

                          {expandedGroups[group.title] && (
                            <div className="px-4 py-3 space-y-3 bg-white">
                              {group.keys.map((key) => (
                                <div key={key.name} className="space-y-1">
                                  <label className="flex items-center text-xs font-medium text-gray-700">
                                    <Key className="mr-1 h-3 w-3 text-purple-600" />
                                    {key.label}
                                  </label>
                                  <input
                                    type="password"
                                    value={apiKeys[key.name] || ""}
                                    onChange={(e) => handleInputChange(key.name, e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    placeholder={`Enter your ${key.label}`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 mb-8">
                <Link
                  href={`/agents/${agentId}`}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md flex items-center"
                  disabled={saving}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
    </ProtectedRoute>
  )
}

