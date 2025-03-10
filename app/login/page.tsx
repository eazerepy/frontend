"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { User, Lock, Bot, Zap, Code, Key, Sparkles, ArrowRight, ExternalLink, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const { login, register, error: authError } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    {
      icon: <Bot className="h-6 w-6 text-purple-600" />,
      title: "AI Agent Creation",
      description: "Create custom AI agents with unique personalities and capabilities.",
    },
    {
      icon: <Key className="h-6 w-6 text-purple-600" />,
      title: "Sonic Integration",
      description: "Seamlessly connect to Sonic's high-performance blockchain infrastructure.",
    },
    {
      icon: <Code className="h-6 w-6 text-purple-600" />,
      title: "No-Code Interface",
      description: "Build powerful AI solutions without writing a single line of code.",
    },
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Instant Deployment",
      description: "Deploy your agents instantly and start interacting with them right away.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Header/Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="scaleElement">
              <img src="/eazerepy.png" alt="eazerepy" width={50} height={50} /> 
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              eazerepy
            </span>
          </div>
          <nav className="md:flex space-x-8 text-xl">
            <button
              onClick={() => scrollToSection("auth")}
              className="mariginal text-gray-600 hover:text-purple-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="mariginal text-gray-600 hover:text-purple-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="mariginal text-gray-600 hover:text-purple-600 transition-colors"
            >
              How It Works
            </button>
            <a
              href="https://docs.soniclabs.com/sonic/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="mariginal text-gray-600 hover:text-purple-600 transition-colors flex items-center"
            >
              Sonic Docs <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <div className="mb-6">
              <h1 className="text-5xl sm:text-6xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  easy
                </span>
                <span
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mx-2"
                  style={{ margin: "0 10px" }}
                >
                  +
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  zerepy
                </span>
              </h1>

              <p
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-4 ml-10"
                style={{ fontSize: "40px" }}
              >
                eazerepy
              </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  AI Agent Kit for{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                    Sonic
                  </span>
                </h2>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Build, customize, and deploy AI agents and integrate into Sonic's high-performance blockchain infrastructure.
                Connect to your favorite services and automate your on-chain workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("auth")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a
                  href="https://docs.soniclabs.com/sonic/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
                >
                  Sonic Docs <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </div>
              <div className="mt-12 text-center md:hidden">
                <button
                  onClick={() => scrollToSection("auth")}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <span className="mr-2">Scroll to Login</span>
                  <ChevronDown className="h-5 w-5 animate-bounce" />
                </button>
              </div>
            </div>
            <div className="md:block relative animate-fadeIn animation-delay-300">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 w-64 h-64 mx-auto my-auto bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <div className="overflow-hidden  w-full h-[400px] bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className="flex-center bg-purple-100 p-1 rounded-full mr-4">
                    <img src="/eazerepy.png" alt="eazerepy" width={60} height={60} /> 
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Sonic Assistant</h3>
                      <div className="flex space-x-2 mt-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Blockchain</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Fast</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-center bg-gray-100 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                        <p className="text-gray-800">Can you help me set up a Sonic wallet?</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-center bg-purple-100 p-2 rounded-full mr-3">
                        <Bot className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-3 max-w-[80%] shadow-sm">
                        <p className="text-gray-800">
                          I'll guide you through setting up a Sonic wallet. First, you'll need to generate a private key
                          and connect to the Sonic network...
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                        <p className="text-gray-800">What are the transaction fees like?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auth Section - Moved to top */}
        <section id="auth" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md mx-auto transform hover:scale-[1.01] transition-transform duration-300">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  {activeTab === "login" ? "Welcome Back" : "Join eazerepy"}
                </h2>

                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`flex-1 py-2 px-4 font-medium ${
                      activeTab === "login"
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 font-medium ${
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
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to create, manage, and deploy intelligent AI agents on Sonic
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create your first Sonic-powered AI agent in just a few simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Agent</h3>
                <p className="text-gray-600">
                  Define your agent's name, bio, and personality traits to give it a unique character.
                </p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Configure Sonic Integration</h3>
                <p className="text-gray-600">
                  Connect your agent to Sonic's blockchain infrastructure by adding your Sonic private key.
                </p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Chatting</h3>
                <p className="text-gray-600">
                  Interact with your agent through a simple chat interface and watch it perform tasks on Sonic for you.
                </p>
              </div>
            </div>
            <div className="mt-16 text-center">
              <a
                href="https://docs.soniclabs.com/sonic/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                Learn More About Sonic <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

       
      </main>
    </div>
  )
}

