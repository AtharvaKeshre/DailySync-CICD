"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Moon,
  Sun,
  Search,
  Bell,
  Users,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
} from "@/components/ui/sidebar"

// Import admin components
import UserManagement from "./admin/user-management"
import JournalOversight from "./admin/journal-oversight"
import AnalyticsDashboard from "./admin/analytics-dashboard"
import AdminLogs from "./admin/admin-logs"
import AdminSettings from "./admin/admin-settings"

export default function AdminLayout() {
  const [activeSection, setActiveSection] = useState("analytics")
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(3)

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    toast({
      title: `${theme === "dark" ? "Light" : "Dark"} theme activated`,
      description: `The dashboard theme has been switched to ${theme === "dark" ? "light" : "dark"} mode.`,
    })
  }

  // Handle sign out
  const handleSignOut = () => {
    signOut()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
  }

  // Handle notification click
  const handleNotificationClick = () => {
    setNotifications(0)
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    })
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-2 py-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AdminPanel</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("analytics")}
                      isActive={activeSection === "analytics"}
                      tooltip="Analytics"
                    >
                      <BarChart2 className="h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("users")}
                      isActive={activeSection === "users"}
                      tooltip="User Management"
                    >
                      <Users className="h-5 w-5" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("journals")}
                      isActive={activeSection === "journals"}
                      tooltip="Journal Oversight"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Journal Oversight</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("logs")}
                      isActive={activeSection === "logs"}
                      tooltip="System Logs"
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span>System Logs</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection("settings")}
                      isActive={activeSection === "settings"}
                      tooltip="Settings"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <span>{user?.name || "Admin User"}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <SidebarInset>
          <div className="flex flex-col h-full">
            {/* Top navigation */}
            <header className="h-16 border-b flex items-center justify-between px-4 bg-background">
              <div className="flex items-center">
                <div className="relative ml-4 w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <Button variant="ghost" size="sm" onClick={handleNotificationClick}>
                        Mark all as read
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications > 0 ? (
                      <>
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <div className="font-medium">New user registered</div>
                          <div className="text-sm text-muted-foreground">Emily Davis just created an account</div>
                          <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <div className="font-medium">Journal entry flagged</div>
                          <div className="text-sm text-muted-foreground">A journal entry was flagged for review</div>
                          <div className="text-xs text-muted-foreground mt-1">15 minutes ago</div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start py-2">
                          <div className="font-medium">System update</div>
                          <div className="text-sm text-muted-foreground">System update completed successfully</div>
                          <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">No new notifications</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </div>
            </header>

            {/* Main content area */}
            <main className="flex-1 overflow-auto p-6">
              {activeSection === "analytics" && <AnalyticsDashboard />}
              {activeSection === "users" && <UserManagement />}
              {activeSection === "journals" && <JournalOversight />}
              {activeSection === "logs" && <AdminLogs />}
              {activeSection === "settings" && <AdminSettings />}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
