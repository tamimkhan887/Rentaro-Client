"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  CalendarCheck2,
  Truck,
  RotateCcw,
  Upload,
  ShieldCheck,
  CheckCircle2,
  BadgeDollarSign,
  ArrowRight,
  Sparkles,
  HelpCircle,
  HardHat,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepItem {
  step: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
}

const renterSteps: StepItem[] = [
  {
    step: "01",
    title: "Search & Filter Equipment",
    description:
      "Explore 6 curated categories across excavators, cameras, trucks, tractors, and audio gear. Filter by depot location, brand, and rental rates.",
    icon: Search,
    badge: "Browse & Compare",
  },
  {
    step: "02",
    title: "Select Dates & Book",
    description:
      "Choose daily, weekly, or monthly duration. Review fully transparent pricing, security deposits, and request instant booking.",
    icon: CalendarCheck2,
    badge: "Transparent Rates",
  },
  {
    step: "03",
    title: "Fast Jobsite Dispatch",
    description:
      "Every machine is safety-inspected and insured. The fleet owner dispatches directly to your project GPS coordinates on time.",
    icon: Truck,
    badge: "Direct Delivery",
  },
  {
    step: "04",
    title: "Work & Seamless Return",
    description:
      "Power through your project with 24/7 technical support. Extend your rental with 1 click online or schedule return pickup.",
    icon: RotateCcw,
    badge: "Flexible Extensions",
  },
]

const ownerSteps: StepItem[] = [
  {
    step: "01",
    title: "List Your Machinery",
    description:
      "Add your equipment details, high-res photos, hourly/daily/monthly rates, and operating terms in under 3 minutes.",
    icon: Upload,
    badge: "Easy Listing",
  },
  {
    step: "02",
    title: "Safety & Fleet Verification",
    description:
      "Our team reviews maintenance history and operating licenses to badge your listing as Verified & Insured.",
    icon: ShieldCheck,
    badge: "Verified Badge",
  },
  {
    step: "03",
    title: "Accept Verified Bookings",
    description:
      "Receive rental requests from verified contractors and creators. Review schedules and accept bookings with escrow security.",
    icon: CheckCircle2,
    badge: "Protected Bookings",
  },
  {
    step: "04",
    title: "Guaranteed Payouts",
    description:
      "Earn consistent rental yield on idle fleet assets. Automated payouts are wired directly to your bank account upon equipment handover.",
    icon: BadgeDollarSign,
    badge: "Automated Escrow",
  },
]

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = React.useState<"renter" | "owner">("renter")
  const currentSteps = activeTab === "renter" ? renterSteps : ownerSteps

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200/70 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3.5 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3.5">
            <HelpCircle className="size-3.5" />
            <span>Simple 4-Step Process</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            How Rentora Works
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Whether you need certified heavy equipment on your jobsite tomorrow or want
            to generate recurring revenue from your idle machinery, getting started takes minutes.
          </p>

          {/* Interactive Role Switcher Toggle */}
          <div className="mt-8 inline-flex items-center rounded-2xl border border-neutral-200 bg-neutral-100 p-1.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("renter")}
              className={`relative flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "renter"
                  ? "bg-[#e77952] text-white shadow-md"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <HardHat className="size-4" />
              <span>For Renters &amp; Contractors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("owner")}
              className={`relative flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "owner"
                  ? "bg-[#e77952] text-white shadow-md"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <Briefcase className="size-4" />
              <span>For Fleet &amp; Equipment Owners</span>
            </button>
          </div>
        </motion.div>

        {/* 4 Steps Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative"
          >
            {currentSteps.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-7 shadow-xs transition-all duration-300 hover:bg-white hover:border-[#e77952]/50 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
                >
                  <div>
                    {/* Top Step Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e77952]/10 text-[#e77952] transition-transform duration-300 group-hover:scale-110 dark:bg-[#e77952]/20 dark:text-[#f49372]">
                        <Icon className="size-6" />
                      </div>

                      <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700 font-mono">
                        {item.step}
                      </span>
                    </div>

                    {/* Step Tag */}
                    <span className="inline-block rounded-md bg-neutral-200/70 dark:bg-neutral-800 px-2.5 py-0.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
                      {item.badge}
                    </span>

                    {/* Step Title */}
                    <h3 className="text-lg font-bold text-neutral-900 transition-colors group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372]">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Step Progress Dot */}
                  <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                    <span>Step {index + 1} of 4</span>
                    <span className="flex size-2 rounded-full bg-[#e77952]" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Section Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          {activeTab === "renter" ? (
            <Link href="/equipment">
              <Button
                variant="brand"
                className="h-11 px-6 rounded-xl font-semibold shadow-md shadow-[#e77952]/20 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Find Machinery Now</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/owner/add-equipment">
              <Button
                variant="brand"
                className="h-11 px-6 rounded-xl font-semibold shadow-md shadow-[#e77952]/20 cursor-pointer inline-flex items-center gap-2"
              >
                <span>List Your First Equipment</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksSection
