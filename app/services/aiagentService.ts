import api from "./api"

export interface AIAgent {
  id: number
  user_id: number 
  agent_name: string
  agent_bio: string[]
  agent_twitter: string
  traits: string[]
  created_at?: string
  updated_at?: string
  evm_private_key?: string
  solana_private_key?: string
  sonic_private_key?: string
  goat_rpc_provider_url?: string
  goat_wallet_private_key?: string
  monad_private_key?: string
  farcaster_mnemonic?: string
  twitter_consumer_key?: string
  twitter_consumer_secret?: string
  twitter_access_token?: string
  twitter_access_token_secret?: string
  twitter_user_id?: string
  twitter_bearer_token?: string
  discord_token?: string
  allora_api_key?: string
  anthropic_api_key?: string
  openai_api_key?: string
  groq_api_key?: string
  xai_api_key?: string
  together_api_key?: string
  hyperbolic_api_key?: string
  galadriel_api_key?: string
  galadriel_fine_tune_api_key?: string
  eternalai_api_key?: string
  eternalai_api_url?: string
}

export interface Message {
  id: number
  conversation_id: number
  role: string
  content: string
  created_at: string
}

export interface Conversation {
  id: number
  agent_id: number
  created_at: string
  messages: Message[]
}

export interface ChatHistory {
  role: string;
  content: string;
  created_at: string;
  conversation_id: number;
  id: number;
}

export const getAIAgents = async (): Promise<AIAgent[]> => {
  const response = await api.get("/aiagents")
  return response.data
}

export const getAIAgent = async (id: number): Promise<AIAgent> => {
  const response = await api.get(`/aiagents/${id}`)
  return response.data
}

export const createAIAgent = async (
  aiagentData: Omit<AIAgent, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<AIAgent> => {
  const response = await api.post("/aiagents", aiagentData)
  return response.data
}

export const updateAIAgent = async (id: number, aiagentData: Partial<AIAgent>): Promise<AIAgent> => {
  const response = await api.put(`/aiagents/${id}`, aiagentData)
  return response.data
}

export const deleteAIAgent = async (id: number): Promise<void> => {
  await api.delete(`/aiagents/${id}`)
}

export const getConversations = async (aiagentId: number): Promise<Conversation[]> => {
  const response = await api.get(`/aiagents/${aiagentId}/conversations`)
  return response.data
}

export const createConversation = async (aiagentId: number): Promise<Conversation> => {
  const response = await api.post<Conversation>(`/aiagents/${aiagentId}/conversations`, { agent_id: aiagentId })
  return response.data
}

export const getMessages = async (aiagentId: number, conversationId: number): Promise<Message[]> => {
  const response = await api.get(`/aiagents/${aiagentId}/conversations/${conversationId}/messages`)
  return response.data
}

export const createMessage = async (aiagentId: number, conversationId: number, messageData: Omit<Message, "id" | "created_at">): Promise<Message> => {
  const response = await api.post(`/aiagents/${aiagentId}/conversations/${conversationId}/messages`, messageData)
  return response.data
}

export const sendMessage =   async (aiagentId: number, chatHistory: Omit<ChatHistory, "id" | "created_at">): Promise<ChatHistory> => {
  const response = await api.post(`/zerepy`, {
    agent_id: aiagentId,
    chatHistory
  })
  return response.data
}

export const sendMessageV2 = async ( aiagentId: number, chatHistory: ChatHistory[]): Promise<Message> => {
  const response = await api.post(`/zerepy/v2`, {
    agent_id: aiagentId,
    chat_history: chatHistory.map((chat) => ({
      ...chat,
      conversation_id: 0
    }))
  });

  return response.data;
};
