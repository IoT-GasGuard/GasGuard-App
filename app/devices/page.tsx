"use client";

import Navbar from "@/components/navbar";
import DeviceManagement from "@/components/device/device-management";
import {useEffect, useState} from "react";
import { Device } from "@/shared/device.model";
import { useRouter } from "next/navigation";

export default function DevicesPage() {
    const [currentTab, setCurrentTab] = useState("device");
    const [devices, setDevices] = useState<Device[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 pt-3">Device Management</h1>
                <DeviceManagement
                    devices={devices}
                    setDevices={setDevices}
                    setAlerts={setAlerts}
                />
            </main>
        </div>
    );
}