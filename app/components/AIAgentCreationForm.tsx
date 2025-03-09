"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, X, Twitter, User, FileText, Tag } from "lucide-react"

const AIAgentCreationForm = () => {
  const router = useRouter()
  const [agentName, setAgentName] = useState("")
  const [bioSentence, setBioSentence] = useState("")
  const [agentBio, setAgentBio] = useState<string[]>([])
  const [agentTwitter, setAgentTwitter] = useState("")
  const [trait, setTrait] = useState("")
  const [traits, setTraits] = useState<string[]>([])
  const [showTraitSuggestions, setShowTraitSuggestions] = useState(false)

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

  const handleAddBioSentence = () => {
    if (bioSentence.trim() !== "") {
      setAgentBio([...agentBio, bioSentence.trim()])
      setBioSentence("")
    }
  }

  const handleRemoveBioSentence = (index: number) => {
    setAgentBio(agentBio.filter((_, i) => i !== index))
  }

  const handleAddTrait = () => {
    if (trait.trim() !== "" && !traits.includes(trait.trim())) {
      setTraits([...traits, trait.trim()])
      setTrait("")
      // Hide suggestions dropdown when manually adding a trait
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store agent data in localStorage to pass to the settings page
    const agentData = { agentName, agentBio, agentTwitter, traits }
    localStorage.setItem("agentData", JSON.stringify(agentData))

    // Navigate to settings page
    router.push("/configure-settings")
  }

  // Handle Enter key press in bio input
  const handleBioKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddBioSentence()
    }
  }

  // Handle Enter key press in trait input
  const handleTraitKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTrait()
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
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

        {/* Submit Button */}
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={agentBio.length === 0}>
            Configure Settings
          </button>
          {agentBio.length === 0 && (
            <p className="text-danger text-center small mt-2">Please add at least one sentence to the bio</p>
          )}
        </div>
      </form>
    </div>
  )
}

export default AIAgentCreationForm

