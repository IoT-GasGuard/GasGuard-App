"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle } from "lucide-react"
import { ReportService } from "@/public/services/report.service"
import { Report } from "@/shared/report.model"
import { Loading } from "@/components/ui/loading"

export default function GasIncidentsReport() {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const reportService = new ReportService()
    const fixedActions = ["Windows open", "Power supply shut off", "Alert sent to emergency contacts"]

    useEffect(() => {
        if (typeof window !== "undefined") {
            const profileId = localStorage.getItem("profileId")
            if (profileId) {
                reportService
                    .getReportsByProfileId(profileId)
                    .then(data => {
                        const mappedReports = data.map((r: any) => new Report(
                            r.id,
                            r.date,
                            r.time,
                            r.device,
                            r.location,
                            r.gasLevel,
                            r.duration,
                            fixedActions,
                            r.resolved
                        ))
                        setReports(mappedReports)
                    })
                    .catch(error => console.error("Error fetching reports:", error))
                    .finally(() => setIsLoading(false))
            }
        } else {
            setIsLoading(false)
        }
    }, [])

    const generateGasLeakReport = () => {
        const reportData = {
            title: "Gas Leak Incident Report",
            content: reports,
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
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="space-y-4">
                            {reports.map(report => (
                                <div key={report.id} className="p-4 gasguard-input rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-medium text-white">
                                                Gas Leak Detected - {report.location}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {report.date} at {report.time}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={report.resolved ? "default" : "destructive"}
                                            className={report.resolved ? "bg-[#00D4AA] text-black" : ""}
                                        >
                                            {report.resolved ? "Resolved" : "Active"}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400">Device</p>
                                            <p className="text-sm text-white">{report.device}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Peak Gas Level</p>
                                            <p className="text-sm text-white">{report.gasLevel}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Duration</p>
                                            <p className="text-sm text-white">{report.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Status</p>
                                            <p className="text-sm text-white">{report.resolved ? "Resolved" : "Active"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">Actions Taken:</p>
                                        <ul className="text-sm text-white space-y-1">
                                            {report.actionsTaken.map((action: string, index: number) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                            <Button
                                onClick={generateGasLeakReport}
                                className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Generate Gas Leak Report
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}