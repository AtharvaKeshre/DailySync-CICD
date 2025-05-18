"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import UserManagement from "@/components/admin/user-management"
import JournalOversight from "@/components/admin/journal-oversight"
import AnalyticsDashboard from "@/components/admin/analytics-dashboard"
import AdminLogs from "@/components/admin/admin-logs"
import AdminSettings from "@/components/admin/admin-settings-continued"
import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen, BarChart2, AlertTriangle, Settings, LogOut, User } from "lucide-react"

export default function AdminPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    if (!loading && (!user || !user.roles?.includes("ADMIN"))) {
      router.push("/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.roles?.includes("ADMIN")) {
    return null // This will be redirected in the useEffect
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 md:w-64 h-full bg-black border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-center md:justify-start px-4 border-b border-gray-800 bg-gradient-to-r from-purple-900 to-indigo-900">
          <Settings className="h-6 w-6 text-purple-400 md:mr-2" />
          <h1 className="text-xl font-bold text-white hidden md:block">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="px-2 space-y-1 flex-grow">
            {/* <Button
              variant={activeTab === "analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart2 className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Analytics</span>
            </Button> */}

            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Users</span>
            </Button>

            {/* <Button
              variant={activeTab === "journals" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("journals")}
            >
              <BookOpen className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Journals</span>
            </Button> */}

            {/* <Button
              variant={activeTab === "logs" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("logs")}
            >
              <AlertTriangle className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">System Logs</span>
            </Button> */}

            {/* <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Settings</span>
            </Button> */}

            {/* <Button variant="ghost" className="w-full justify-start mt-8" onClick={() => router.push("/")}>
              <Home className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Back to Dashboard</span>
            </Button> */}
          </nav>
           {/* Logout section */}
<div className="p-4 border-t border-gray-800 mt-auto">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-full bg-purple-900 flex items-center justify-center">
        <User className="h-4 w-4 text-purple-300" />
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-medium text-gray-200">{user?.userName || "Admin"}</p>
        <p className="text-xs text-gray-400">{user?.email || "admin@example.com"}</p>
      </div>
    </div>
    <Button variant="ghost" size="icon" onClick={signOut} className="hidden md:flex">
      <LogOut className="h-4 w-4" />
    </Button>
  </div>
</div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "journals" && <JournalOversight />}
        {activeTab === "logs" && <AdminLogs />}
        {activeTab === "settings" && <AdminSettings />}
      </main>

     

    </div>
  )
}
