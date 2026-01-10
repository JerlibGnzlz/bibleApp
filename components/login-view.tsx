"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import { BookOpen, ShieldCheck } from "lucide-react"

export function LoginView() {
    const { loginWithGoogle, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-50/30 to-primary/10">
                <div className="animate-pulse flex flex-col items-center">
                    <BookOpen className="h-12 w-12 text-primary mb-4 opacity-50" />
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.svg')] bg-cover relative overflow-hidden">
            {/* Fondo con degradado animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/20 z-0" />

            {/* Círculos decorativos de fondo */}
            <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl opacity-60 animate-in fade-in duration-1000" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl opacity-50 animate-in fade-in duration-1000 delay-300" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="glass-panel p-8 rounded-2xl shadow-2xl border-white/40 dark:border-white/10 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">

                    <div className="bg-primary/10 p-4 rounded-full ring-4 ring-primary/5">
                        <BookOpen className="h-12 w-12 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            Bienvenido
                        </h1>
                        <p className="text-muted-foreground">
                            Planificador de Prédicas Personal
                        </p>
                    </div>

                    <div className="w-full space-y-4">
                        <Button
                            size="lg"
                            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                            onClick={loginWithGoogle}
                        >
                            <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Continuar con Google
                        </Button>

                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 opacity-70">
                            <ShieldCheck className="h-3 w-3" />
                            Tus datos se guardan en este dispositivo
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground/60">
                    Iglesia Casa de Restauración
                </p>
            </div>
        </div>
    )
}
