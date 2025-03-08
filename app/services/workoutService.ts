import api from "./api"

export const getWorkouts = async () => {
  const response = await api.get("/workouts/workouts")
  return response.data
}

export const getWorkout = async (id) => {
  const response = await api.get(`/workouts/workouts/${id}`)
  return response.data
}

export const createWorkout = async (workoutData) => {
  const response = await api.post("/workouts", workoutData)
  return response.data
}

export const updateWorkout = async (id, workoutData) => {
  const response = await api.put(`/workouts/${id}`, workoutData)
  return response.data
}

export const deleteWorkout = async (id) => {
  const response = await api.delete(`/workouts/${id}`)
  return response.data
}

