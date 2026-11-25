"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminAllRentalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("AdminAllRentals route error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-rose-500/30 shadow-sm">
        <CardContent className="p-8 text-center space-y-5">
          <div className="size-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Failed to Load Rental Records
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error?.message || "An unexpected error occurred while fetching platform rental bookings."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button onClick={reset} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white">
              <RefreshCw className="size-4" />
              <span>Try Again</span>
            </Button>
            <Link href="/dashboard/admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="size-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
