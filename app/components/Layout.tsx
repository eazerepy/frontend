"use client"

import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"

const Layout = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth()
  const [year, setYear] = useState("") // Start with empty string

  // Set the year on the client side only
  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            eazerepy
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link href="/" className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/tries" className="nav-link">
                      Tries
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex">
              {isAuthenticated ? (
                <button onClick={logout} className="btn btn-outline-light">
                  Logout
                </button>
              ) : (
                <Link href="/login" className="btn btn-outline-light">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 py-4">
        <div className="container">{children}</div>
      </main>

      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center">
          <p className="mb-0">© {year} Fitness Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

