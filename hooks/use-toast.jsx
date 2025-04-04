// hooks/use-toast.ts
import { toast as sonnerToast } from "sonner"

export function useToast() {
    return {
        toast: sonnerToast
    }
}