"use client"

import { useState } from "react"
import { BookOpen, BarChart3, Settings, User, LogOut, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import JournalDashboard from "@/components/journal-dashboard"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import TodoModal from "@/components/todo-modal"
import { useRouter } from "next/navigation"
import { triggerSentimentAnalysisEmail } from "@/services/journalService" // or wherever the file is


export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("journal")
  const [todoModalOpen, setTodoModalOpen] = useState(false)
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    signOut()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 md:w-64 h-full bg-black border-r border-gray-800 flex flex-col ">
        {/* Header */}
        <div className="h-16 flex items-center justify-center md:justify-start px-4 border-b  border-gray-800 bg-gradient-to-r from-purple-900 to-indigo-900">
          <BookOpen className="h-6 w-6 text-purple-400 md:mr-2 mt-4" />
          <h1 className="text-xl font-bold text-white hidden md:block mt-4 ">Mindful Journal</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="px-2 space-y-1">
            <Button
              variant={activeTab === "journal" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("journal")}
            >
              <BookOpen className="h-5 w-5 md:mr-2 "  />
              Journal
            </Button>

            {/* <Button
              variant={activeTab === "analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Analytics</span>
            </Button> */}

            {/* <Button
              variant="ghost"
              className="w-full justify-start text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
              onClick={() => setTodoModalOpen(true)}
            >
              <ListTodo className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Todo List</span>
            </Button> */}

            {user?.role === "admin" && (
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin")}>
                <Settings className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Admin Panel</span>
              </Button>
            )}

<div className="px-2 mt-4">
  <Button
    variant="default"
    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
    onClick={async () => {
      toast({
        title: "Sending Analysis Email...",
        description: "Please wait while we process your sentiment analysis.",
      });

      try {
        await triggerSentimentAnalysisEmail();
        toast({
          title: "Email Sent",
          description: "Sentiment analysis report has been emailed successfully.",
        });
      } catch (error) {
        toast({
          title: "Failed to Send Email",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    }}
  >
    Get Analysis
  </Button>
</div>

          </nav>
        </div>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-900 flex items-center justify-center">
                <User className="h-4 w-4 text-purple-300" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-200">{user?.name || "User Name"}</p>
                <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === "journal" && <JournalDashboard  />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </main>

      {/* Todo modal */}
      {/* <TodoModal isOpen={todoModalOpen} onClose={() => setTodoModalOpen(false)} /> */}
    </div>
  )
}
