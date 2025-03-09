"use client"

import Link from "next/link"
import { logout } from "@/services/authService"
import { useRouter } from "next/navigation"

const Header = () => {

  const router = useRouter()

  const handleLogout = () => {
    logout();
    router.push("/login")
    console.log("User logged out")
  }

  return (
    <header className="bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  eazerepy
                </span>
              </Link>
            </div>
          </div>

          <div>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/agents"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Agents
              </Link>
              <Link
                href="/create"
                className="px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                Create
              </Link>
              {/* <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">U</div> */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
