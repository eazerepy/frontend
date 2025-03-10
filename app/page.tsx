"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import Header from "@/components/Header"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <div className="bodywrapper min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome to eazerepy</h1>
                <p className="text-purple-100 mt-1">Manage your AI agents with ease</p>
              </div>

              <div className="welcome-mascot" style={{
                marginLeft: "100px",
                display: "flex",
                
              }}>
                <Image
                  src="/eazerepy.png"
                  alt="Hero Image"
                  width={160}
                  height={160}
                />
              </div>
            </div>

            <div>
              


            </div>

            <div className="p-8 space-y-6">
              <p className="text-gray-600 mb-6">
                Create and manage your AI agents to automate tasks, interact with various platforms, and leverage
                powerful AI models.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/create"
                  className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-md transition-colors"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Agent
                </Link>

                <Link
                  href="/agents"
                  className="flex items-center justify-center py-4 px-6 bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-medium rounded-md shadow-sm transition-colors"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Your Agents
                </Link>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Getting Started</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Create a new agent by clicking the "Create New Agent" button</li>
                  <li>Configure your agent with a name, bio, and traits</li>
                  <li>Add API keys for the services your agent will interact with</li>
                  <li>Manage your agents from the "View Your Agents" page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

