import { DashboardHeader } from "@/components/dashboard-header"
import { DeviceManagement } from "@/components/device-management"

export default function DevicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardHeader />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Device Management</h1>
        <DeviceManagement />
      </main>
    </div>
  )
}
