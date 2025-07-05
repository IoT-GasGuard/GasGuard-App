import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeviceService } from "@/public/services/device.service";
import { Device } from "@/shared/device.model";
import {useRouter} from "next/navigation";

interface DeviceSelectorProps {
    selectedDeviceId: string | null;
    onDeviceChange: (deviceId: string | null) => void;
}

export function DeviceSelector({ selectedDeviceId, onDeviceChange }: DeviceSelectorProps) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileId, setProfileId] = useState<string | null>(null);

    const router = useRouter()
    useEffect(() => {

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/")
            }
        }
    }, [router])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem("profileId");
            setProfileId(id);
        }
    }, []);

    useEffect(() => {
        const fetchDevices = async () => {
            if (!profileId) return;

            try {
                const deviceService = new DeviceService();
                const deviceData = await deviceService.getAllDevicesByProfileId(profileId);

                const devicesMapped = deviceData.map(
                    (d: any) => new Device(d.id, d.deviceId, d.name, d.status, d.lastReading, d.gasLevel, d.location)
                );
                setDevices(devicesMapped);

                if (!selectedDeviceId && devicesMapped.length > 0) {
                    onDeviceChange(devicesMapped[0].deviceId);
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, [selectedDeviceId, onDeviceChange, profileId]);

    return (
        <div className="w-full max-w-xs">
            <Select value={selectedDeviceId || ""} onValueChange={onDeviceChange}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder={loading ? "Loading..." : "Select a Device"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                    {loading ? (
                        <SelectItem disabled value="loading" className="text-gray-400">
                            Loading...
                        </SelectItem>
                    ) : (
                        devices.map((device) => (
                            <SelectItem key={device.id} value={device.deviceId} className="text-white hover:bg-gray-800">
                                {device.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}