"use client";

import ReportsSection from "@/components/reports/reports-view";
import {useState} from "react";
import Navbar from "@/components/navbar";


const mockDevices = [
    {
        id: "1",
        name: "Kitchen Sensor",
        status: "online" as const,
        lastReading: "2024-01-20T14:30:00",
        gasLevel: 15,
        location: "Kitchen"
    }
];

const mockAlerts = [
    {
        id: "1",
        type: "gas" as const,
        message: "Gas leak detected",
        timestamp: "2024-01-20T14:30:00",
        severity: "high" as const
    }
];

export default function ReportsPage() {
    const [currentTab, setCurrentTab] = useState("reports")

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab}/>
            <main className="container mx-auto p-4">
                <ReportsSection
                    devices={mockDevices}
                    alerts={mockAlerts}
                />
            </main>
        </div>

)
    ;
}