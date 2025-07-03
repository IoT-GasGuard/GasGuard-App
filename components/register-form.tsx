"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/public/services/auth.service"

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const authService = new AuthService()

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("El nombre es requerido")
            return false
        }

        if (!formData.email.trim()) {
            setError("El correo electrónico es requerido")
            return false
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres")
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const response = await authService.registerUser({
                email: formData.email,
                password: formData.password,
            })
            console.log("Registro exitoso:", response)


            router.push("/login?registered=true")
        } catch (err) {
            setError("Ocurrió un error durante el registro. Inténtalo de nuevo.")
            console.error("Error en el registro:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center">GasGuard</CardTitle>
                <CardDescription className="text-center">Únete al monitoreo de calidad del aire</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repite tu contraseña"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <a href="/login" className="underline hover:text-primary">
                        Iniciar sesión
                    </a>
                </p>
            </CardFooter>
        </Card>
    )
}