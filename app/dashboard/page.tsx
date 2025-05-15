import { DashboardHeader } from "@/components/dashboard-header"
import { AirQualityChart } from "@/components/air-quality-chart"
import { AirQualityStatus } from "@/components/air-quality-status"
import { ActuatorStatus } from "@/components/actuator-status"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardHeader />
      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Gas Level Dashboard</h1>

        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Real-time Gas levels</h2>
          <AirQualityChart />
        </div>

        {/* status and actuators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Gas Safety Level</h2>
            <AirQualityStatus />
          </div>

          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Actuator Status</h2>
            <ActuatorStatus />
          </div>
        </div>
      </main>
    </div>
  )
}
