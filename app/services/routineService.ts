import api from "./api"

export const getRoutines = async () => {
  const response = await api.get("/routines")
  return response.data
}

export const getRoutine = async (id) => {
  const response = await api.get(`/routines/${id}`)
  return response.data
}

export const createRoutine = async (routineData) => {
  const response = await api.post("/routines", routineData)
  return response.data
}

export const updateRoutine = async (id, routineData) => {
  const response = await api.put(`/routines/${id}`, routineData)
  return response.data
}

export const deleteRoutine = async (id) => {
  const response = await api.delete(`/routines/${id}`)
  return response.data
}

