"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
    User,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"
import { toast } from "sonner"

interface AuthContextType {
    user: User | null
    loading: boolean
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Suscribirse a cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            toast.success("¡Bienvenido!")
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error)
            const errorMessage = error.code === 'auth/popup-closed-by-user'
                ? "Inicio de sesión cancelado"
                : "Error al conectar con Google. Verifica tu configuración."

            toast.error(errorMessage)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            toast.info("Sesión cerrada")
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
            toast.error("Error al cerrar sesión")
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}
