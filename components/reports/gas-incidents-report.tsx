"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle } from "lucide-react"

const gasLeakIncidents = [
    {
        id: "1",
        date: "2024-01-15",
        time: "14:30",
        device: "Kitchen Sensor",
        location: "Kitchen",
        gasLevel: 85,
        duration: "5 minutes",
        actionsTaken: ["Windows open", "Power supply shut off", "Alert sent to emergency contacts"],
        resolved: true,
    },
    {
        id: "2",
        date: "2024-01-10",
        time: "09:15",
        device: "Living Room Sensor",
        location: "Living Room",
        gasLevel: 72,
        duration: "3 minutes",
        actionsTaken: ["Windows open", "Power supply shut off", "Alert sent to emergency contacts"],
        resolved: true,
    },
]

export default function GasIncidentsReport() {
    const generateGasLeakReport = () => {
        const reportData = {
            title: "Gas Leak Incident Report",
            content: gasLeakIncidents,
            filename: `gas-leak-report-${Date.now()}.json`,
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
            <Card className="gasguard-card">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Gas Leak Incident Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {gasLeakIncidents.map((incident) => (
                            <div key={incident.id} className="p-4 gasguard-input rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-medium text-white">Gas Leak Detected - {incident.location}</h3>
                                        <p className="text-sm text-gray-400">
                                            {incident.date} at {incident.time}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={incident.resolved ? "default" : "destructive"}
                                        className={incident.resolved ? "bg-[#00D4AA] text-black" : ""}
                                    >
                                        {incident.resolved ? "Resolved" : "Active"}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Device</p>
                                        <p className="text-sm text-white">{incident.device}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Peak Gas Level</p>
                                        <p className="text-sm text-white">{incident.gasLevel}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Duration</p>
                                        <p className="text-sm text-white">{incident.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Status</p>
                                        <p className="text-sm text-white">{incident.resolved ? "Resolved" : "Active"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Actions Taken:</p>
                                    <ul className="text-sm text-white space-y-1">
                                        {incident.actionsTaken.map((action, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        <Button onClick={generateGasLeakReport} className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
                            <Download className="w-4 h-4 mr-2" />
                            Generate Gas Leak Report
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
