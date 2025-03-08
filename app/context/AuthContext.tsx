"use client"

import { createContext, useState, useEffect, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
} from "../services/authService"

interface AuthContextType {
  user: any
  login: (username: string, password: string) => Promise<any>
  logout: () => void
  register: (username: string, password: string) => Promise<any>
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      try {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error("Authentication check failed:", err)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (username: string, password: string) => {
    setError(null)
    try {
      const userData = await loginService(username, password)
      setUser(userData)
      router.push("/")
      return userData
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.")
      throw err
    }
  }

  const register = async (username: string, password: string) => {
    setError(null)
    try {
      await registerService(username, password)
      return await login(username, password)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.")
      throw err
    }
  }

  const logout = () => {
    logoutService()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        error,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext