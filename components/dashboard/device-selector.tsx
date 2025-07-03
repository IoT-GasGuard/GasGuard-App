import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeviceService } from "@/public/services/device.service";

interface Device {
    id: string;
    name: string;
    deviceId: string;
    type: string;
}

interface DeviceSelectorProps {
    selectedDeviceId: string | null;
    onDeviceChange: (deviceId: string | null) => void;
}

export function DeviceSelector({ selectedDeviceId, onDeviceChange }: DeviceSelectorProps) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const profileId = localStorage.getItem("profileId");

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const deviceService = new DeviceService();
                const deviceData = await deviceService.getAllDevicesByProfileId(profileId);
                setDevices(deviceData);

                if (!selectedDeviceId && deviceData.length > 0) {
                    onDeviceChange(deviceData[0].deviceId);
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
                    {loading
                        ? (
                            <SelectItem disabled value="loading" className="text-gray-400">
                                Loading...
                            </SelectItem>
                        )
                        : (
                            devices.map((device) => (
                                <SelectItem
                                    key={device.id}
                                    value={device.deviceId}
                                    className="text-white hover:bg-gray-800"
                                >
                                    {device.name}
                                </SelectItem>
                            ))
                        )}
                </SelectContent>
            </Select>
        </div>
    );
}