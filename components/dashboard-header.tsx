"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    router.push("/")
  }

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/GasGuardLogo.png" alt="Logo" className="h-32 w-32" />
          
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#32B3A8]",
              pathname === "/dashboard" ? "text-[#32B3A8]" : "text-gray-400",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/devices"
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#32B3A8]",
              pathname === "/devices" ? "text-[#32B3A8]" : "text-gray-400",
            )}
          >
            Devices
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm text-gray-400 hover:text-[#32B3A8]">
              <User className="h-4 w-4 mr-2" />
              demo@example.com
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
