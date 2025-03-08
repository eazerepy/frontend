import api from "./api"

export const login = async (username, password) => {
  const formData = new FormData()
  formData.append("username", username)
  formData.append("password", password)

  const response = await api.post("/auth/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token)
  }

  return response.data
}

export const register = async (username, password) => {
  const response = await api.post("/auth", { username, password })
  return response.data
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const getCurrentUser = () => {
  const token = localStorage.getItem("token")
  return token ? { token } : null
}

