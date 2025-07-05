"use client"

import { jsPDF } from 'jspdf';
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
        const doc = new jsPDF();


        const primaryColor: [number, number, number] = [0, 212, 170];
        const textColor: [number, number, number] = [255, 255, 255];
        const backgroundColor: [number, number, number] = [31, 41, 55];
        const dangerColor: [number, number, number] = [239, 68, 68];


        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("Gas Leak Incident Report", 105, 20, { align: 'center' });

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 40);
        doc.text(`Total Incidents: ${reports.length}`, 10, 45);

        let yPos = 60;

        reports.forEach((report, index) => {

            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Encabezado del reporte individual
            doc.setFillColor(248, 250, 252); // gray-50
            doc.rect(10, yPos - 5, 190, 15, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Incident #${index + 1}`, 15, yPos + 5);

            // Badge de estado
            if (report.resolved) {
                doc.setFillColor(...primaryColor);
                doc.setTextColor(0, 0, 0);
            } else {
                doc.setFillColor(...dangerColor);
                doc.setTextColor(255, 255, 255);
            }
            doc.rect(160, yPos - 3, 30, 10, 'F');
            doc.setFontSize(8);
            doc.text(report.resolved ? "RESOLVED" : "ACTIVE", 175, yPos + 3, { align: 'center' });

            yPos += 20;


            doc.setTextColor(60, 60, 60);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');


            const infoItems = [
                ['Location:', report.location],
                ['Date & Time:', `${report.date} at ${report.time}`],
                ['Device:', report.device],
                ['Peak Gas Level:', `${report.gasLevel}%`],
                ['Duration:', report.duration]
            ];

            infoItems.forEach(([label, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 15, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(value, 60, yPos);
                yPos += 8;
            });

            // Acciones tomadas
            yPos += 5;
            doc.setFont('helvetica', 'bold');
            doc.text('Actions Taken:', 15, yPos);
            yPos += 8;

            doc.setFont('helvetica', 'normal');
            report.actionsTaken.forEach((action: string) => {
                doc.setFillColor(...primaryColor);
                doc.circle(18, yPos - 2, 1, 'F');
                doc.text(action, 25, yPos);
                yPos += 6;
            });


            doc.setDrawColor(200, 200, 200);
            doc.line(10, yPos + 5, 200, yPos + 5);
            yPos += 20;
        });

        doc.save(`gas-leak-report-${Date.now()}.pdf`);
    };

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