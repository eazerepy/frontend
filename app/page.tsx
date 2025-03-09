"use client"

import { useState } from "react"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import AIAgentCreationForm from "@/components/AIAgentCreationForm"

export default function Home() {
  const [error, setError] = useState<string | null>(null)

  return (
    <ProtectedRoute>
      <Layout>
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create New AI Agent</h5>
              </div>
              <div className="card-body p-0">
                <AIAgentCreationForm />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

