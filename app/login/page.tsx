"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { User, Lock } from "lucide-react"

export default function Login() {
  const { login, register, error: authError } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(username, password)
    } catch (err) {
      setError(authError || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await register(registerUsername, registerPassword)
    } catch (err) {
      setError(authError || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white">Welcome to EasyZerepy</h2>
            <p className="text-purple-100 mt-1">Please login or register to continue</p>
          </div>

          <div className="p-6">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "login"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "register"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {error}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="label-agent-class flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-2 h-5 w-5 text-purple-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-agent-class flex items-center text-sm font-medium text-gray-700">
                    <Lock className="mr-2 h-5 w-5 text-purple-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="label-agent-class flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-2 h-5 w-5 text-purple-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-agent-class flex items-center text-sm font-medium text-gray-700">
                    <Lock className="mr-2 h-5 w-5 text-purple-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

