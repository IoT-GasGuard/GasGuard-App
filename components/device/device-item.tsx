import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {Device} from "@/shared/device.model";

interface DeviceItemProps {
    device: Device
    onEdit: (device: Device) => void
    onDelete: (deviceId: string) => void
}

export default function DeviceItem({ device, onEdit, onDelete }: DeviceItemProps) {
    return (
        <div className="flex items-center justify-between p-4 gasguard-input rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00D4AA]" />
                <div>
                    <h3 className="font-medium text-white">{device.name}</h3>
                    <p className="text-sm text-gray-400">Last seen: {device.lastReading}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(device)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(device.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}