import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Device} from "@/shared/device.model";

interface EditDeviceDialogProps {
    device: Device | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSave: () => void
    onCancel: () => void
    onChange: (field: string, value: string) => void
}

export default function EditDeviceDialog({
                                             device,
                                             isOpen,
                                             onOpenChange,
                                             onSave,
                                             onCancel,
                                             onChange,
                                         }: EditDeviceDialogProps) {
    if (!device) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="gasguard-card">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Device</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Device ID</Label>
                        <Input
                            value={device.deviceId}
                            onChange={(e) => onChange("deviceId", e.target.value)}
                            className="gasguard-input text-white border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Device Name</Label>
                        <Input
                            value={device.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="gasguard-input text-white border-0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white">Location</Label>
                        <Input
                            value={device.location}
                            onChange={(e) => onChange("location", e.target.value)}
                            className="gasguard-input text-white border-0"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={onSave}
                            className="flex-1 bg-[#00D4AA] hover:bg-[#00B894] text-black border-0"
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}