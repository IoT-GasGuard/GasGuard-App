"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/public/services/auth.service"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const authService = new AuthService()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await authService.authenticate(email, password)
            console.log("Autenticación exitosa:", response)

            // Redirigir al dashboard después de iniciar sesión
            router.push("/dashboard")
        } catch (err) {
            setError("Credenciales inválidas. Inténtalo de nuevo.")
            console.error("Error en el inicio de sesión:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegisterRedirect = () => {
        router.push("/register")
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">GasGuard</CardTitle>
                <CardDescription className="text-center">
                    Monitoreo de calidad del aire en tiempo real
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <a
                        href="#"
                        className="underline"
                        onClick={handleRegisterRedirect}
                    >
                        Registrarse
                    </a>
                </p>
            </CardFooter>
        </Card>
    )
}