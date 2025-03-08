import api from "./api"

export const getTries = async () => {
  const response = await api.get("/tries")
  return response.data
}

export const getTry = async (id) => {
  const response = await api.get(`/tries/${id}`)
  return response.data
}

export const createTry = async (tryData) => {
  const response = await api.post("/tries", tryData)
  return response.data
}

export const updateTry = async (id, tryData) => {
  const response = await api.put(`/tries/${id}`, tryData)
  return response.data
}

export const deleteTry = async (id) => {
  const response = await api.delete(`/tries/${id}`)
  return response.data
}