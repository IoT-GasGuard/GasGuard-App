"use client";

import LightingControl from '@/components/lighting-control';
import {useState} from "react";
import Navbar from "@/components/navbar";


export default function LightingPage() {

    const [systemStatus, setSystemStatus] = useState({
        ventilationActive: false,
        powerShutoffActive: false,
        lightingAuto: true,
        lightIntensity: 70
    });

    const [alerts, setAlerts] = useState([]);
    const [currentTab, setCurrentTab] = useState("lighting");

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab}/>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-white  pt-3 pb-5">Lighting Control</h1>
                <LightingControl
                    systemStatus={systemStatus}
                    setSystemStatus={setSystemStatus}
                    setAlerts={setAlerts}
                />
            </main>
        </div>

)
    ;
}