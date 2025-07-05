"use client";

import  Navigation  from "@/components/navbar"
import { AirQualityChart } from "@/components/dashboard/air-quality-chart"
import { AirQualityStatus } from "@/components/dashboard/air-quality-status"
import { useAirQuality } from "@/context/air-quality-context"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {DeviceSelector} from "@/components/dashboard/device-selector";

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState("dashboard")
  const { selectedDeviceId, setSelectedDeviceId } = useAirQuality()
  //to redirect to login if no token is found (the user is not logged in)
  const router = useRouter()
  useEffect(() => {

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
      }
    }
  }, [router])

  return (
      <div className="min-h-screen bg-black text-white">
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab}/>
        <main className="container mx-auto p-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3">
            <h1 className="text-3xl font-bold">Gas Level Dashboard</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm text-gray-400">Devices:</span>
              <DeviceSelector selectedDeviceId={selectedDeviceId} onDeviceChange={setSelectedDeviceId}/>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-6 gasguard-card">
            <h2 className="text-xl font-bold mb-4">Real-time Gas levels - {selectedDeviceId}</h2>
            <AirQualityChart/>
          </div>

          {/* status and actuators */}
          <div className="grid grid-cols-1 gap-6 ">
            <div className="border border-gray-800 rounded-lg p-6 pb-16 gasguard-card">
              <h2 className="text-xl font-bold mb-4">Gas Safety Level</h2>
              <AirQualityStatus/>
            </div>
          </div>
        </main>
      </div>
  )
}
