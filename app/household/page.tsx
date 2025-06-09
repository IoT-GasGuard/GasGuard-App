"use client";

import {useState} from "react";
import Navbar from "@/components/navbar";
import HouseholdMembers from "@/components/household-members/household-members-view";

export default function HouseholdPage() {
    const [currentTab, setCurrentTab] = useState("household");
    const [alerts, setAlerts] = useState<any[]>([]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-white pt-3">Household Members</h1>
                <HouseholdMembers setAlerts={setAlerts}/>
            </main>
        </div>
    );
}