import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AirQualityProvider } from "@/context/air-quality-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GasGuard",
  description: "IoT Air Quality Monitoring System",
    generator: 'v0.dev',
  icons:{
    icon:"/flame-logo.svg"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AirQualityProvider>{children}</AirQualityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
