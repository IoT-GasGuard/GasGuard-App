"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Activity, FileText, Lightbulb, User, BarChart3, Users, LogOut, ChevronDown } from "lucide-react"

interface NavigationProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [email, setUserEmail]= useState("")
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    //if the email exist and is in localstorage
    if(email){
      setUserEmail(email)
    }
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleNavigation = (tab: string, path: string) => {
    onTabChange(tab);
    router.push(path);
  }

  return (
      <nav className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/GasGuardLogo.png" alt="Logo" className="h-44 w-44"/>
            </div>

            <div className="flex items-center gap-1">
              <Button
                  variant={currentTab === "dashboard" ? "secondary" : "ghost"}
                  onClick={() => handleNavigation("dashboard", "/dashboard")}
                  className={`text-white hover:text-white ${
                      currentTab === "dashboard" ? "bg-gray-800 text-[#00D4AA]" : "hover:bg-gray-800"
                  }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                  variant={currentTab === "device-management" ? "secondary" : "ghost"}
                  onClick={() => handleNavigation("device-management", "/devices")}
                  className={`text-white hover:text-white ${
                      currentTab === "device-management" ? "bg-gray-800 text-[#00D4AA]" : "hover:bg-gray-800"
                  }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Devices
              </Button>
              <Button
                  variant={currentTab === "reports" ? "secondary" : "ghost"}
                  onClick={() => handleNavigation("reports", "/reports")}
                  className={`text-white hover:text-white ${
                      currentTab === "reports" ? "bg-gray-800 text-[#00D4AA]" : "hover:bg-gray-800"
                  }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button
                  variant={currentTab === "lighting" ? "secondary" : "ghost"}
                  onClick={() => handleNavigation("lighting", "/lighting")}
                  className={`text-white hover:text-white ${
                      currentTab === "lighting" ? "bg-gray-800 text-[#00D4AA]" : "hover:bg-gray-800"
                  }`}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Lighting
              </Button>
            </div>

            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{email || "Usuario"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                <DropdownMenuItem
                    onClick={() => handleNavigation("household", "/household")}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Household Members
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-gray-700 hover:text-red-300 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
  )
}