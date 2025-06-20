import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface AlertMessageProps {
    message: string
    type: "success" | "error"
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
    if (!message) return null

    return (
        <Alert className={type === "success" ? "bg-green-900 border-green-700" : "bg-red-900 border-red-700"}>
            {type === "success" ?
                <CheckCircle className="h-4 w-4" /> :
                <AlertTriangle className="h-4 w-4" />
            }
            <AlertDescription className={type === "success" ? "text-green-100" : "text-red-100"}>
                {message}
            </AlertDescription>
        </Alert>
    )
}