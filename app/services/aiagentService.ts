import api from "./api"

export const getAIAgents = async () => {
  const response = await api.get("/aiagents")
  return response.data
}

export const getAIAgent = async (id: number) => {
  const response = await api.get(`/aiagents/${id}`)
  return response.data
}

export const createAIAgent = async (aiagentData: any) => {
  const response = await api.post("/aiagents", aiagentData)
  return response.data
}

export const updateAIAgent = async (id: number, aiagentData: any) => {
  const response = await api.put(`/aiagents/${id}`, aiagentData)
  return response.data
}

export const deleteAIAgent = async (id: number) => {
  const response = await api.delete(`/aiagents/${id}`)
  return response.data
}