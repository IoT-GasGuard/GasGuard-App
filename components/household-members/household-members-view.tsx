
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, CheckCircle, AlertTriangle, Users, Phone, Mail, Bell } from "lucide-react"
import { HouseholdService } from "@/public/services/household.service"
import { HouseholdMemberModel } from "@/shared/householdMember.model"

interface HouseholdMember {
    id: string
    name: string
    email: string
    phone: string
    emergencyContact: boolean
    gasAlerts: boolean
}

interface HouseholdMembersProps {
    setAlerts: (alerts: any) => void
}

export default function HouseholdMembers({ setAlerts }: HouseholdMembersProps) {
    const [members, setMembers] = useState<HouseholdMember[]>([])
    const [profileId, setProfileId] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        phone: "",
        emergencyContact: false,
        gasAlerts: true,
    })

    const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null)
    const [showSuccess, setShowSuccess] = useState("")
    const [showError, setShowError] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const householdService = new HouseholdService()

    useEffect(() => {
        const storedProfileId = localStorage.getItem('profileId')
        if (storedProfileId) {
            setProfileId(storedProfileId)
            fetchHouseholdMembers(storedProfileId)
        } else {
            setLoading(false)
            setShowError("No user profile found. Please log in again.")
        }
    }, [])

    const fetchHouseholdMembers = async (id: string) => {
        try {
            setLoading(true)
            const data = await householdService.getHouseholdMembersByProfileId(id)
            setMembers(data)
        } catch (error) {
            console.error("Error fetching household members:", error)
            setShowError("Could not load household members. Please try again later.")
            setTimeout(() => setShowError(""), 3000)
        } finally {
            setLoading(false)
        }
    }

    const validateMember = (member: any) => {
        if (!member.name.trim()) return "Name is required"
        if (!member.email.trim()) return "Email is required"
        if (!member.phone.trim()) return "Phone number is required"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(member.email)) return "Please enter a valid email address"

        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(member.phone.replace(/[\s\-()]/g, ""))) return "Please enter a valid phone number"

        return null
    }

    const handleAddMember = async () => {
        const error = validateMember(newMember)
        if (error) {
            setShowError(error)
            setTimeout(() => setShowError(""), 3000)
            return
        }

        // Check if email already exists
        if (members.some((m) => m.email === newMember.email)) {
            setShowError("A member with this email already exists")
            setTimeout(() => setShowError(""), 3000)
            return
        }

        try {
            const householdMemberData = {
                ...newMember,
                profileId: profileId
            }

            const createdMember = await householdService.createHouseholdMember(householdMemberData)
            await fetchHouseholdMembers(profileId)
            setNewMember({
                name: "",
                email: "",
                phone: "",
                emergencyContact: false,
                gasAlerts: true,
            })
            setIsAddDialogOpen(false)
            setShowSuccess(`${createdMember.name} has been added to your household members`)

            setAlerts((prev: any) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "system",
                    message: `New member "${createdMember.name}" added to notification list`,
                    timestamp: new Date().toLocaleString(),
                    severity: "low",
                },
            ])

            setTimeout(() => setShowSuccess(""), 3000)
        } catch (error) {
            console.error("Error adding member:", error)
            setShowError("Could not add member. Please try again later.")
            setTimeout(() => setShowError(""), 3000)
        }
    }

    const handleEditMember = async () => {
        if (!editingMember) return

        const error = validateMember(editingMember)
        if (error) {
            setShowError(error)
            setTimeout(() => setShowError(""), 3000)
            return
        }

        // Check if email already exists
        if (members.some((m) => m.email === editingMember.email && m.id !== editingMember.id)) {
            setShowError("A member with this email already exists")
            setTimeout(() => setShowError(""), 3000)
            return
        }

        try {
            await householdService.updateHouseholdMember(editingMember.id, editingMember)
            setMembers(members.map((m) => (m.id === editingMember.id ? editingMember : m)))
            setShowSuccess(`${editingMember.name}'s information has been updated`)
            setIsEditDialogOpen(false)
            setEditingMember(null)

            setAlerts((prev: any) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "system",
                    message: `Member "${editingMember.name}" information updated`,
                    timestamp: new Date().toLocaleString(),
                    severity: "low",
                },
            ])

            setTimeout(() => setShowSuccess(""), 3000)
        } catch (error) {
            console.error("Error updating member:", error)
            setShowError("Could not update information. Please try again later.")
            setTimeout(() => setShowError(""), 3000)
        }
    }

    const handleDeleteMember = async (profileId: string) => {
        const member = members.find((m) => m.id === profileId)
        if (!member) return

        try {
            await householdService.deleteHouseholdMember(profileId)
            setMembers(members.filter((m) => m.id !== profileId))
            setShowSuccess(`${member.name} has been removed from household members`)

            setAlerts((prev: any) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "system",
                    message: `Member "${member.name}" removed from notification list`,
                    timestamp: new Date().toLocaleString(),
                    severity: "low",
                },
            ])

            setTimeout(() => setShowSuccess(""), 3000)
        } catch (error) {
            console.error("Error deleting member:", error)
            setShowError("Could not remove member. Please try again later.")
            setTimeout(() => setShowError(""), 3000)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 mt-2">Manage who receives notifications when gas alerts are detected</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#00D4AA] hover:bg-[#00B894] text-black font-medium border-0">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="gasguard-card max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add Household Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-white">Full Name</Label>
                                <Input
                                    placeholder="Enter full name"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    className="gasguard-input text-white border-0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    className="gasguard-input text-white border-0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Phone Number</Label>
                                <Input
                                    placeholder="Enter phone number"
                                    value={newMember.phone}
                                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                    className="gasguard-input text-white border-0"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Emergency Contact</p>
                                        <p className="text-sm text-gray-400">Receive priority notifications</p>
                                    </div>
                                    <Switch
                                        checked={newMember.emergencyContact}
                                        onCheckedChange={(checked) => setNewMember({ ...newMember, emergencyContact: checked })}
                                        className="data-[state=checked]:bg-[#00D4AA]"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Gas Alerts</p>
                                        <p className="text-sm text-gray-400">Receive gas detection notifications</p>
                                    </div>
                                    <Switch
                                        checked={newMember.gasAlerts}
                                        onCheckedChange={(checked) => setNewMember({ ...newMember, gasAlerts: checked })}
                                        className="data-[state=checked]:bg-[#00D4AA]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={handleAddMember}
                                    className="flex-1 bg-[#00D4AA] hover:bg-[#00B894] text-black border-0"
                                    disabled={!newMember.name || !newMember.email || !newMember.phone}
                                >
                                    Add Member
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {showSuccess && (
                <Alert className="bg-green-900 border-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-100">{showSuccess}</AlertDescription>
                </Alert>
            )}

            {showError && (
                <Alert className="bg-red-900 border-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-100">{showError}</AlertDescription>
                </Alert>
            )}

            <Card className="gasguard-card">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Registered Members ({members.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-gray-400 py-8">Loading household members...</p>
                    ) : members.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-2">No household members registered</p>
                            <p className="text-sm text-gray-500">Add members to receive gas leak notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {members.map((member) => (
                                <div key={member.id} className="p-4 gasguard-input rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-white">{member.name}</h3>
                                                {member.emergencyContact && (
                                                    <Badge variant="default" className="bg-red-600 text-white">
                                                        Emergency Contact
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                    {member.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Phone className="w-4 h-4" />
                                                    {member.phone}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Bell className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-400">Notifications:</span>
                                                    {member.gasAlerts ? (
                                                        <Badge variant="outline" className="text-[#00D4AA] border-[#00D4AA]">
                                                            Gas Alerts
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-500">None</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingMember(member)}
                                                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="gasguard-card max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-white">Edit Member</DialogTitle>
                                                    </DialogHeader>
                                                    {editingMember && (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-white">Full Name</Label>
                                                                <Input
                                                                    value={editingMember.name}
                                                                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                                                    className="gasguard-input text-white border-0"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-white">Email Address</Label>
                                                                <Input
                                                                    type="email"
                                                                    value={editingMember.email}
                                                                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                                                                    className="gasguard-input text-white border-0"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-white">Phone Number</Label>
                                                                <Input
                                                                    value={editingMember.phone}
                                                                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                                                                    className="gasguard-input text-white border-0"
                                                                />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-medium">Emergency Contact</p>
                                                                        <p className="text-sm text-gray-400">Receive priority notifications</p>
                                                                    </div>
                                                                    <Switch
                                                                        checked={editingMember.emergencyContact}
                                                                        onCheckedChange={(checked) =>
                                                                            setEditingMember({ ...editingMember, emergencyContact: checked })
                                                                        }
                                                                        className="data-[state=checked]:bg-[#00D4AA]"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-medium">Gas Alerts</p>
                                                                        <p className="text-sm text-gray-400">Receive gas detection notifications</p>
                                                                    </div>
                                                                    <Switch
                                                                        checked={editingMember.gasAlerts}
                                                                        onCheckedChange={(checked) =>
                                                                            setEditingMember({ ...editingMember, gasAlerts: checked })
                                                                        }
                                                                        className="data-[state=checked]:bg-[#00D4AA]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 pt-4">
                                                                <Button
                                                                    onClick={handleEditMember}
                                                                    className="flex-1 bg-[#00D4AA] hover:bg-[#00B894] text-black border-0"
                                                                >
                                                                    Save Changes
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setIsEditDialogOpen(false)
                                                                        setEditingMember(null)
                                                                    }}
                                                                    className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="gasguard-card">
                <CardHeader>
                    <CardTitle className="text-white">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 gasguard-input rounded-lg">
                            <h3 className="font-medium text-white mb-2">Gas Leak Alert Protocol</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                When gas levels exceed safe thresholds, the following actions will be taken:
                            </p>
                            <ul className="text-sm text-white space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                    Emergency contacts receive immediate SMS and email alerts
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                    All members with gas alerts enabled are notified
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                    Automatic activation of ventilation system
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full" />
                                    Gas supply shutdown if levels remain high
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}