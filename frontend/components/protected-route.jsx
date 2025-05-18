"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const hasRole = user?.roles?.some(
    (r) => r.toLowerCase() === requiredRole?.toLowerCase()
  )

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin")
      } else if (requiredRole && !hasRole) {
        // Redirect based on role
        if (user.roles?.includes("ADMIN")) {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    }
  }, [user, loading, router, requiredRole, hasRole])

  // Show loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // If role is required and user doesn't have it
  if (requiredRole && !hasRole) {
    return null // Will be redirected by the useEffect
  }

  return children
}
