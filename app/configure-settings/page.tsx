"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings, Key, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import { createAIAgent } from "@/services/aiagentService"

const apiKeyGroups = [
  {
    title: "AI Models",
    keys: [
      { name: "ALLORA_API_KEY", label: "Allora API Key" },
      { name: "ANTHROPIC_API_KEY", label: "Anthropic API Key" },
      { name: "OPENAI_API_KEY", label: "OpenAI API Key" },
      { name: "GROQ_API_KEY", label: "Groq API Key" },
      { name: "XAI_API_KEY", label: "XAI API Key" },
      { name: "TOGETHER_API_KEY", label: "Together API Key" },
      { name: "HYPERBOLIC_API_KEY", label: "Hyperbolic API Key" },
      { name: "GALADRIEL_API_KEY", label: "Galadriel API Key" },
      { name: "GALADRIEL_FINE_TUNE_API_KEY", label: "Galadriel Fine Tune API Key" },
      { name: "EternalAI_API_KEY", label: "Eternal AI API Key" },
      { name: "EternalAI_API_URL", label: "Eternal AI API URL" },
    ],
  },
  {
    title: "Blockchain",
    keys: [
      { name: "EVM_PRIVATE_KEY", label: "EVM Private Key" },
      { name: "SOLANA_PRIVATE_KEY", label: "Solana Private Key" },
      { name: "SONIC_PRIVATE_KEY", label: "Sonic Private Key" },
      { name: "GOAT_RPC_PROVIDER_URL", label: "Goat RPC Provider URL" },
      { name: "GOAT_WALLET_PRIVATE_KEY", label: "Goat Wallet Private Key" },
      { name: "MONAD_PRIVATE_KEY", label: "Monad Private Key" },
    ],
  },
  {
    title: "Social Media",
    keys: [
      { name: "FARCASTER_MNEMONIC", label: "Farcaster Mnemonic" },
      { name: "TWITTER_CONSUMER_KEY", label: "Twitter Consumer Key" },
      { name: "TWITTER_CONSUMER_SECRET", label: "Twitter Consumer Secret" },
      { name: "TWITTER_ACCESS_TOKEN", label: "Twitter Access Token" },
      { name: "TWITTER_ACCESS_TOKEN_SECRET", label: "Twitter Access Token Secret" },
      { name: "TWITTER_USER_ID", label: "Twitter User ID" },
      { name: "TWITTER_BEARER_TOKEN", label: "Twitter Bearer Token" },
      { name: "DISCORD_TOKEN", label: "Discord Token" },
    ],
  },
]

const initialApiKeys: Record<string, string> = {}
apiKeyGroups.forEach((group) => {
  group.keys.forEach((key) => {
    initialApiKeys[key.name] = ""
  })
})

export default function ConfigureSettings() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(initialApiKeys)
  const [agentData, setAgentData] = useState<any>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("ConfigureSettings page loaded")

    const initialExpandedState: Record<string, boolean> = {}
    apiKeyGroups.forEach((group) => {
      initialExpandedState[group.title] = true
    })
    setExpandedGroups(initialExpandedState)

    const storedAgentData = localStorage.getItem("agentData")
    if (storedAgentData) {
      console.log("Agent data found in localStorage", storedAgentData);
      setAgentData(JSON.parse(storedAgentData))
      console.log("Agent data found in localStorage", agentData);

    }

    const savedApiKeys = localStorage.getItem("apiKeys")
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys))
      console.log("API keys found in localStorage", savedApiKeys);
    }
    console.log("API keuysssss", apiKeys);
  }, [])


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Save API keys to localStorage
    localStorage.setItem("apiKeys", JSON.stringify(apiKeys))
    console.log("Agent Data", agentData)
    try {
      // Create AI agent
      const newAgent = await createAIAgent({
        agent_name: agentData?.agentName || "Default Agent Name",
        agent_bio: agentData?.agentBio || [],
        agent_twitter: agentData?.agentTwitter || "",
        traits: agentData?.traits || [],
        evm_private_key: apiKeys.EVM_PRIVATE_KEY,
        solana_private_key: apiKeys.SOLANA_PRIVATE_KEY,
        sonic_private_key: apiKeys.SONIC_PRIVATE_KEY,
        goat_rpc_provider_url: apiKeys.GOAT_RPC_PROVIDER_URL,
        goat_wallet_private_key: apiKeys.GOAT_WALLET_PRIVATE_KEY,
        monad_private_key: apiKeys.MONAD_PRIVATE_KEY,
        farcaster_mnemonic: apiKeys.FARCASTER_MNEMONIC,
        twitter_consumer_key: apiKeys.TWITTER_CONSUMER_KEY,
        twitter_consumer_secret: apiKeys.TWITTER_CONSUMER_SECRET,
        twitter_access_token: apiKeys.TWITTER_ACCESS_TOKEN,
        twitter_access_token_secret: apiKeys.TWITTER_ACCESS_TOKEN_SECRET,
        twitter_user_id: apiKeys.TWITTER_USER_ID,
        twitter_bearer_token: apiKeys.TWITTER_BEARER_TOKEN,
        discord_token: apiKeys.DISCORD_TOKEN,
        allora_api_key: apiKeys.ALLORA_API_KEY,
        anthropic_api_key: apiKeys.ANTHROPIC_API_KEY,
        openai_api_key: apiKeys.OPENAI_API_KEY,
        groq_api_key: apiKeys.GROQ_API_KEY,
        xai_api_key: apiKeys.XAI_API_KEY,
        together_api_key: apiKeys.TOGETHER_API_KEY,
        hyperbolic_api_key: apiKeys.HYPERBOLIC_API_KEY,
        galadriel_api_key: apiKeys.GALADRIEL_API_KEY,
        galadriel_fine_tune_api_key: apiKeys.GALADRIEL_FINE_TUNE_API_KEY,
        eternalai_api_key: apiKeys.EternalAI_API_KEY,
        eternalai_api_url: apiKeys.EternalAI_API_URL,
      })

      console.log("Agent created with:", newAgent)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // In a real app, you would send the agent data and API keys to your backend
        console.log("Agent created with:", newAgent)
        
        // Navigate to success page or dashboard
        alert("Agent created successfully!")
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Failed to create agent:", error)
      setIsLoading(false)
      alert("Failed to create agent. Please try again.")
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Configure API Settings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-purple-100 mr-2" />
              <h2 className="text-xl font-bold text-white">API Keys Configuration</h2>
            </div>
            <p className="text-purple-100 mt-1">
              Configure the API keys needed for your agent to interact with various services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="py-8 px-8">
            <div className="space-y-6">
              {apiKeyGroups.map((group) => (
                <div key={group.title} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 text-left"
                  >
                    <span className="text-lg font-medium text-gray-800">{group.title}</span>
                    <span className="text-gray-500">{expandedGroups[group.title] ? "−" : "+"}</span>
                  </button>

                  {expandedGroups[group.title] && (
                    <div className="px-6 py-4 space-y-4 bg-white">
                      {group.keys.map((key) => (
                        <div key={key.name} className="space-y-1">
                          <label className="label-agent-class flex items-center text-sm font-medium text-gray-700">
                            <Key className="mr-2 h-4 w-4 text-purple-600" />
                            {key.label}
                          </label>
                          <input
                            type="password"
                            value={apiKeys[key.name] || ""}
                            onChange={(e) => handleInputChange(key.name, e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            placeholder={`Enter your ${key.label}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              <p className="text-sm text-gray-500">
                Note: You don't need to fill in all API keys. Only add the ones required for your agent's functionality.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
              >
                {isLoading ? "Creating Agent..." : "Create Agent"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}