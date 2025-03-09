"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getAIAgent, updateAIAgent } from "@/services/aiagentService"
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
      } catch (err) {
        console.error(`Failed to fetch agent ${agentId}:`, err)
        setError("Failed to load agent details. Please try again later.")
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
        <div className="mb-4">
          <button onClick={() => router.back()} className="btn btn-outline-secondary mb-3">
            <ArrowLeft size={16} className="me-2" /> Back
          </button>

          <div className="d-flex justify-content-between align-items-center">
            <h1>Edit Agent: {agentName}</h1>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Basic Information</h5>
                </div>
                <div className="card-body">
                  {/* Agent Name */}
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center">
                      <User className="me-2" size={18} />
                      <span>Agent Name</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Enter agent name"
                      required
                    />
                  </div>

                  {/* Agent Bio */}
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center">
                      <FileText className="me-2" size={18} />
                      <span>Agent Bio</span>
                    </label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={bioSentence}
                        onChange={(e) => setBioSentence(e.target.value)}
                        onKeyPress={handleBioKeyPress}
                        placeholder="Add a sentence to the bio (press Enter or click +)"
                      />
                      <button type="button" className="btn btn-primary" onClick={handleAddBioSentence}>
                        <PlusCircle size={18} />
                      </button>
                    </div>

                    {/* Display added bio sentences */}
                    {agentBio.length > 0 && (
                      <div className="mt-3">
                        <p className="text-muted small">Added sentences:</p>
                        <div className="list-group">
                          {agentBio.map((sentence, index) => (
                            <div
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>{sentence}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBioSentence(index)}
                                className="btn btn-sm btn-outline-danger"
                                aria-label="Remove sentence"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">{bioSentence.length} characters in current sentence</small>
                      <small className="text-muted">{agentBio.length}/3 sentences</small>
                    </div>
                  </div>

                  {/* Agent Traits */}
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center">
                      <Tag className="me-2" size={18} />
                      <span>Agent Traits</span>
                    </label>
                    <div className="position-relative">
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={trait}
                          onChange={(e) => setTrait(e.target.value)}
                          onKeyPress={handleTraitKeyPress}
                          onFocus={() => setShowTraitSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowTraitSuggestions(false), 200)
                          }}
                          placeholder="Add a trait (press Enter or click +)"
                        />
                        <button type="button" className="btn btn-primary" onClick={handleAddTrait}>
                          <PlusCircle size={18} />
                        </button>
                      </div>

                      {/* Trait suggestions */}
                      {showTraitSuggestions && (
                        <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1 z-index-dropdown">
                          <div className="p-2 border-bottom">
                            <small className="text-muted">Suggested Traits</small>
                          </div>
                          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {traitSuggestions.map((suggestion) => (
                              <div
                                key={suggestion}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className={`p-2 cursor-pointer hover-bg-light ${traits.includes(suggestion) ? "opacity-50" : ""}`}
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
                        <p className="text-muted small">Added traits:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {traits.map((t) => (
                            <div key={t} className="badge bg-light text-dark border d-flex align-items-center p-2">
                              {t}
                              <button
                                type="button"
                                onClick={() => handleRemoveTrait(t)}
                                className="btn-close ms-2 btn-close-sm"
                                aria-label="Remove trait"
                              ></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <small className="text-muted d-block mt-2">{traits.length} traits added</small>
                  </div>

                  {/* Agent Twitter */}
                  <div className="form-group mb-4">
                    <label className="form-label d-flex align-items-center">
                      <Twitter className="me-2" size={18} />
                      <span>Agent Twitter</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">@</span>
                      <input
                        type="text"
                        className="form-control"
                        value={agentTwitter}
                        onChange={(e) => setAgentTwitter(e.target.value)}
                        placeholder="twitter_handle"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">API Keys</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">
                    Configure the API keys needed for your agent to interact with various services.
                  </p>

                  {apiKeyGroups.map((group) => (
                    <div key={group.title} className="mb-3 border rounded">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.title)}
                        className="w-100 d-flex justify-content-between align-items-center p-2 bg-light border-0 text-start"
                      >
                        <span className="fw-medium">{group.title}</span>
                        <span>{expandedGroups[group.title] ? "−" : "+"}</span>
                      </button>

                      {expandedGroups[group.title] && (
                        <div className="p-3">
                          {group.keys.map((key) => (
                            <div key={key.name} className="mb-3">
                              <label className="form-label d-flex align-items-center small">
                                <Key className="me-1" size={14} />
                                {key.label}
                              </label>
                              <input
                                type="password"
                                className="form-control form-control-sm"
                                value={apiKeys[key.name] || ""}
                                onChange={(e) => handleInputChange(key.name, e.target.value)}
                                placeholder={`Enter ${key.label}`}
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

          <div className="d-flex justify-content-end gap-2 mb-5">
            <Link href={`/agents/${agentId}`} className="btn btn-outline-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} className="me-1" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
    </ProtectedRoute>
  )
}

