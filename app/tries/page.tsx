"use client"

import { useState, useEffect, FormEvent } from "react"
import Layout from "../components/Layout"
import ProtectedRoute from "../components/ProtectedRoute"
import { getTries, createTry, deleteTry } from "../services/tryService"
import LoadingSpinner from "../components/LoadingSpinner"

interface Try {
  id: string
  name: string
  description: string
}

export default function Tries() {
  const [tries, setTries] = useState<Try[]>([])
  const [tryName, setTryName] = useState<string>("")
  const [tryDescription, setTryDescription] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchTries()
  }, [])

  const fetchTries = async () => {
    try {
      setLoading(true)
      const data = await getTries()
      setTries(data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch tries:", err)
      setError("Failed to load tries. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTry = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const newTry = { name: tryName, description: tryDescription }
      await createTry(newTry)
      setTryName("")
      setTryDescription("")
      setSuccessMessage("Try created successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchTries()
    } catch (err) {
      console.error("Failed to create try:", err)
      setError("Failed to create try. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTry = async (tryId: string) => {
    try {
      setLoading(true)
      await deleteTry(tryId)
      setSuccessMessage("Try deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchTries()
    } catch (err) {
      console.error("Failed to delete try:", err)
      setError("Failed to delete try. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  if (loading && tries.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Tries</h1>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Try</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateTry}>
                  <div className="mb-3">
                    <label htmlFor="tryName" className="form-label">
                      Try Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tryName"
                      value={tryName}
                      onChange={(e) => setTryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tryDescription" className="form-label">
                      Try Description
                    </label>
                    <textarea
                      className="form-control"
                      id="tryDescription"
                      rows={3}
                      value={tryDescription}
                      onChange={(e) => setTryDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Try"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Your Tries</h2>
            {tries.length === 0 ? (
              <div className="alert alert-info">You don't have any tries yet. Create one above!</div>
            ) : (
              <div className="row">
                {tries.map((tryItem) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={tryItem.id}>
                    <div className="card h-100">
                      <div className="card-header bg-info text-white">
                        <h5 className="mb-0">{tryItem.name}</h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">{tryItem.description}</p>
                      </div>
                      <div className="card-footer d-flex justify-content-end">
                        <button
                          onClick={() => handleDeleteTry(tryItem.id)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}