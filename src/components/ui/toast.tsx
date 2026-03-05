import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toastEmitter } from "@/api/client"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((message, type) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: type === "error" ? "错误" : "成功",
          description: message,
          variant: type === "error" ? "destructive" : "default",
        },
      ])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    })

    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center justify-between gap-4 rounded-lg border p-4 shadow-lg transition-all",
              toast.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-border bg-background text-foreground"
            )}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && (
                <p className="text-sm opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded p-1 hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
