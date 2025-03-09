"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Header from "./components/Header"


export default function Home() {
  const [error, setError] = useState<string | null>(null)

  return (
    <ProtectedRoute>
      <Header />
       <div className="">
          <a href="/create" className="flex btn btn-primary">Create New Agent</a>
          <a href="/agents" className="flex btn btn-primary">View Agents</a>
       </div>
     
    </ProtectedRoute>
  )
}

