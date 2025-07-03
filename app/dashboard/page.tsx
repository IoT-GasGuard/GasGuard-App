"use client";

import  Navigation  from "@/components/navbar"
import { AirQualityChart } from "@/components/dashboard/air-quality-chart"
import { AirQualityStatus } from "@/components/dashboard/air-quality-status"

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState("dashboard")

  //to redirect to login if no token is found (the user is not logged in)
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white">
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold  pt-3">Gas Level Dashboard</h1>

        <div className="border border-gray-800 rounded-lg p-6 gasguard-card">
          <h2 className="text-xl font-bold mb-4">Real-time Gas levels</h2>
          <AirQualityChart />
        </div>

        {/* status and actuators */}
        <div className="grid grid-cols-1 gap-6 ">
          <div className="border border-gray-800 rounded-lg p-6 pb-16 gasguard-card">
            <h2 className="text-xl font-bold mb-4">Gas Safety Level</h2>
            <AirQualityStatus />
          </div>
        </div>
      </main>
    </div>
  )
}
