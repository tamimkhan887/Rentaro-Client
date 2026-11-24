"use client"

import * as React from "react"
import Link from "next/link"
import { Printer, LayoutDashboard, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CheckoutReceiptActions() {
  const [copied, setCopied] = React.useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
      <Link href="/dashboard/customer/my-rentals">
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm">
          <LayoutDashboard className="h-4 w-4" />
          <span>View in My Rentals</span>
        </Button>
      </Link>

      <Link href="/equipment">
        <Button variant="outline" className="gap-2">
          <Search className="h-4 w-4" />
          <span>Browse More Equipment</span>
        </Button>
      </Link>

      <Button variant="secondary" onClick={handlePrint} className="gap-2">
        <Printer className="h-4 w-4" />
        <span>Print Receipt</span>
      </Button>
    </div>
  )
}
