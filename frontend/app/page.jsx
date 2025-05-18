import ProtectedRoute from "@/components/protected-route"
import DashboardView from "@/components/dashboard-view"

export default function Home() {
  return (
    <ProtectedRoute requiredRole="user">
      <DashboardView />
    </ProtectedRoute>
  )
}
