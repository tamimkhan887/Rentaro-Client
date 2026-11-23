"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { LayoutDashboard, Loader2 } from "lucide-react"

export default function DashboardIndexPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  React.useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace("/login")
      return
    }

    const role = (session.user.role || "").toLowerCase()
    if (role === "admin") {
      router.replace("/dashboard/admin")
    } else if (role === "owner") {
      router.replace("/dashboard/owner")
    } else {
      router.replace("/dashboard/customer")
    }
  }, [session, isPending, router])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#e77952]/10 text-[#e77952] mb-4">
        <LayoutDashboard className="size-7" />
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <Loader2 className="size-4 animate-spin text-[#e77952]" />
        <span>Loading your dashboard...</span>
      </div>
    </div>
  )
}
