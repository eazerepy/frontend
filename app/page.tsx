"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import Header from "./components/Header"


export default function Home() {

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
