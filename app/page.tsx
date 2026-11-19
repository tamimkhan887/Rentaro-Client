import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock, Wrench } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
    </div>
  )
}
