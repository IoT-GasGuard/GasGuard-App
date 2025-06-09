"use client";

import Navbar from "@/components/navbar";
import DeviceManagement from "@/components/device-management";
import { useState } from "react";

interface Device {
    id: string;
    name: string;
    status: "online" | "offline" | "alert";
    lastReading: string;
    gasLevel: number;
    location: string;
}

export default function DevicesPage() {
    const [currentTab, setCurrentTab] = useState("device");
    const [devices, setDevices] = useState<Device[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Device Management</h1>
                <DeviceManagement
                    devices={devices}
                    setDevices={setDevices}
                    setAlerts={setAlerts}
                />
            </main>
        </div>
    );
}