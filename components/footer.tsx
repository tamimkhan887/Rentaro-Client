"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  HardHat,
  Sparkles,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState("")
  const [isSubscribed, setIsSubscribed] = React.useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      toast.add({
        title: "Invalid Email",
        description: "Please enter a valid business or personal email address.",
        type: "error",
      })
      return
    }

    setIsSubscribed(true)
    toast.add({
      title: "Subscribed Successfully!",
      description: "You will receive exclusive rental discounts and fleet updates.",
      type: "success",
    })
    setNewsletterEmail("")
  }

  return (
    <footer className="relative border-t border-neutral-200/80 bg-black text-neutral-300 dark:border-neutral-800 dark:bg-black">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Info & Newsletter (Col span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              {/* Light Mode Logo */}
              <Image
                src="/Logo-dark.png"
                alt="Rentora Logo"
                width={145}
                height={48}
                className="h-12 w-auto object-contain dark:hidden "
              />
              {/* Dark Mode Logo */}
              <Image
                src="/Logo-dark.png"
                alt="Rentora Logo"
                width={145}
                height={48}
                className="h-12 w-auto object-contain hidden dark:block"
              />
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Rentora is the premier marketplace connecting contractors, builders,
              and creative crews with verified heavy machinery and professional
              production equipment on demand.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Stay Updated with Fleet Releases
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 text-xs text-white placeholder:text-neutral-500 focus:border-[#e77952] focus:bg-neutral-800 focus:outline-none"
                  required
                />
                <Button
                  type="submit"
                  variant="brand"
                  className="h-10 px-3.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span className="hidden sm:inline">Join</span>
                </Button>
              </form>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Quick Categories Navigation (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Equipment Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link
                  href="/equipment?category=Construction+Equipment"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Construction Equipment</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">120+</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Photography+Equipment"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Photography Equipment</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">85+</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Vehicles+%26+Transportation"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Vehicles &amp; Transportation</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">65+</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Agriculture+Equipment"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Agriculture Equipment</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">50+</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Electronics"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Electronics &amp; Workstations</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">40+</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Event+Equipment"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>Event Equipment &amp; Audio</span>
                  <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">55+</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/equipment"
                  className="text-[#e77952] hover:text-[#f49372] font-semibold flex items-center gap-1 group"
                >
                  <span>View All Equipment</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* For Renters & Fleet Owners (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform &amp; Roles
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/equipment" className="hover:text-white transition-colors">
                  Browse Fleet
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner/add-equipment" className="hover:text-white transition-colors">
                  List Your Machinery
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner" className="hover:text-white transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-white transition-colors">
                  Renter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Rentora
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Direct Hotline (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Assistance
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Phone className="size-4 text-[#e77952] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">+1 (800) 555-RENT</p>
                  <p className="text-[11px] text-neutral-500">24/7 Emergency Dispatch</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="size-4 text-[#e77952] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">support@rentora.com</p>
                  <p className="text-[11px] text-neutral-500">Average response &lt; 15 mins</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#e77952] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">National Fleet Headquarters</p>
                  <p className="text-[11px] text-neutral-500">Houston &bull; Dallas &bull; Los Angeles &bull; Chicago</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-white">System Status: All Systems Operational</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  99.98% Jobsite Dispatch Uptime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Copyright & Attribution Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            <p>
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">Rentora Inc.</span> All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-neutral-300 transition-colors">
              Security &amp; Escrow
            </Link>
            <Link href="/insurance" className="hover:text-neutral-300 transition-colors">
              Equipment Insurance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
