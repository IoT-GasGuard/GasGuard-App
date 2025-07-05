"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "lucide-react"
import GasIncidentsReport from "@/components/reports/gas-incidents-report"
import NormalOperationsReport from "@/components/reports/normal-operations-report"

interface Device {
    id: string
    name: string
    status: "online" | "offline" | "alert"
    lastReading: string
    gasLevel: number
    location: string
}

interface Alert {
    id: string
    type: "gas" | "system" | "device"
    message: string
    timestamp: string
    severity: "low" | "medium" | "high"
}

interface ReportsSectionProps {
    devices: Device[]
    alerts: Alert[]
}

export default function ReportsSection({ devices, alerts }: ReportsSectionProps) {
    const generateSystemReport = () => {
        const timestamp = new Date().toLocaleString()
        const reportData = {
            title: "System Status Report",
            content: { devices, alerts, timestamp },
            filename: `system-status-report-${Date.now()}.json`,
        }

        const blob = new Blob([JSON.stringify(reportData.content, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = reportData.filename
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white pt-3">Reports & Analytics</h1>
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <Tabs defaultValue="incidents" className="space-y-6">
                <TabsList className="bg-black border border-gray-800">
                    <TabsTrigger
                        value="incidents"
                        className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-black text-white"
                    >
                        Gas Incidents
                    </TabsTrigger>

                   {/* <TabsTrigger
                        value="normal"
                        className="data-[state=active]:bg-[#00D4AA] data-[state=active]:text-black text-white"
                    >
                        Normal Operations
                    </TabsTrigger>*/}
                </TabsList>

                <TabsContent value="incidents">
                    <GasIncidentsReport />
                </TabsContent>

                <TabsContent value="normal">
                    <NormalOperationsReport />
                </TabsContent>
            </Tabs>
        </div>
    )
}
