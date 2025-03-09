"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, X, Twitter, User, FileText, Tag } from "lucide-react"
import { useAuth } from "@/context/AuthContext" // Add this import

const CreateComponent = () => {
  const router = useRouter()
  const { user } = useAuth() // Get the authenticated user
  const [agentName, setAgentName] = useState("")
  const [bioSentence, setBioSentence] = useState("")
  const [agentBio, setAgentBio] = useState<string[]>([])
  const [agentTwitter, setAgentTwitter] = useState("")
  const [trait, setTrait] = useState("")
  const [traits, setTraits] = useState<string[]>([])
  const [showTraitSuggestions, setShowTraitSuggestions] = useState(false)

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
    const agentData = {
      agentName,
      agentBio,
      agentTwitter,
      traits,
    }
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
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white">Create New Agent</h2>
            <p className="text-purple-100 mt-1">Fill in the details to create your custom agent</p>
          </div>

          <form onSubmit={handleSubmit} className="py-8 px-8 space-y-8">
            {/* Agent Name */}
            <div className="space-y-2">
              <label className="label-agent-class flex items-center text-lg font-medium text-gray-700">
                <User className="mr-2 h-5 w-5 text-purple-600" />
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter agent name"
                required
              />
            </div>

            {/* Agent Bio - Modified to add sentences one by one */}
            <div className="space-y-2">
              <label className="label-agent-class flex items-center text-lg font-medium text-gray-700">
                <FileText className="mr-2 h-5 w-5 text-purple-600" />
                Agent Bio
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={bioSentence}
                  onChange={(e) => setBioSentence(e.target.value)}
                  onKeyPress={handleBioKeyPress}
                  className="flex-grow px-4 py-3 rounded-l-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                      <div key={index} className="flex items-start bg-gray-100 rounded-md p-3 border border-gray-200">
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

            {/* Agent Traits - Reverted to pill style but with improvements */}
            <div className="space-y-2">
              <label className="label-agent-class flex items-center text-lg font-medium text-gray-700">
                <Tag className="mr-2 h-5 w-5 text-purple-600" />
                Agent Traits
              </label>
              <div className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={trait}
                    onChange={(e) => setTrait(e.target.value)}
                    onKeyPress={handleTraitKeyPress}
                    onFocus={() => setShowTraitSuggestions(true)}
                    onBlur={() => {
                      // Delay hiding to allow for clicks on suggestions
                      setTimeout(() => setShowTraitSuggestions(false), 200)
                    }}
                    className="flex-grow px-4 py-3 rounded-l-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">Suggested Traits</div>
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

              {/* Display selected traits in pill style */}
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
              <label className="label-agent-class flex items-center text-lg font-medium text-gray-700">
                <Twitter className="mr-2 h-5 w-5 text-purple-600" />
                Agent Twitter
              </label>
              <div className="flex">
                <div className="flex items-center px-4 bg-gray-100 border-y border-l border-gray-300 rounded-l-md text-gray-500">
                  @
                </div>
                <input
                  type="text"
                  value={agentTwitter}
                  onChange={(e) => setAgentTwitter(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-r-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="twitter_handle"
                />
              </div>
            </div>

            {/* Submit Button - Changed to "Configure Settings" */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
                disabled={agentBio.length === 0}
              >
                Configure Settings
              </button>
              {agentBio.length === 0 && (
                <p className="text-sm text-red-500 mt-2 text-center">Please add at least one sentence to the bio</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateComponent

