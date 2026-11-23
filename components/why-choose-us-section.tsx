"use client"

import * as React from "react"
import Link from "next/link"
import {
  BadgeDollarSign,
  UserCheck,
  CalendarClock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Truck,
  Headphones,
  Award,
  Sparkles,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface BenefitItem {
  id: string
  title: string
  tagline: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  points: string[]
  iconColor: string
  iconBg: string
  borderColor: string
  hoverShadow: string
}

const benefits: BenefitItem[] = [
  {
    id: "pricing",
    title: "Affordable Rental Prices",
    tagline: "Transparent & Competitive",
    description:
      "Access enterprise-tier heavy machinery and gear at verified market rates with zero surprise markups or hidden fees.",
    icon: BadgeDollarSign,
    points: [
      "Zero hidden fees or surprise fuel charges",
      "Tiered discounts for weekly & monthly rentals",
      "Competitive rate matching guarantee",
    ],
    iconColor: "text-[#e77952]",
    iconBg: "bg-[#e77952]/10 dark:bg-[#e77952]/20",
    borderColor: "hover:border-[#e77952]/50",
    hoverShadow: "hover:shadow-[#e77952]/10",
  },
  {
    id: "verified-owners",
    title: "Verified Equipment Owners",
    tagline: "Vetted & Certified Fleets",
    description:
      "Every equipment supplier undergoes strict identity checks, safety inspections, and maintenance log verification.",
    icon: UserCheck,
    points: [
      "Rigorous identity & business vetting",
      "Routine mechanical safety inspections",
      "Verified maintenance & service records",
    ],
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    borderColor: "hover:border-emerald-500/50",
    hoverShadow: "hover:shadow-emerald-500/10",
  },
  {
    id: "flexible-periods",
    title: "Flexible Rental Periods",
    tagline: "Tailored to Your Schedule",
    description:
      "Rent by the day, week, or month. Adapt on the fly with seamless timeline extensions and instant online booking management.",
    icon: CalendarClock,
    points: [
      "Custom daily, weekly & monthly bookings",
      "One-click online duration extensions",
      "Instant reservation & deployment readiness",
    ],
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    borderColor: "hover:border-blue-500/50",
    hoverShadow: "hover:shadow-blue-500/10",
  },
  {
    id: "secure-payments",
    title: "Secure Payments",
    tagline: "Protected Escrow & Encryption",
    description:
      "Bank-grade encrypted transactions with security deposit protection. Funds are safely held until machinery is accepted on-site.",
    icon: CreditCard,
    points: [
      "256-bit bank-grade encryption",
      "Escrow protection for rental security deposits",
      "Instant digital invoices & automated receipts",
    ],
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    borderColor: "hover:border-purple-500/50",
    hoverShadow: "hover:shadow-purple-500/10",
  },
]

const stats = [
  { label: "Verified Machines", value: "500+", icon: Award },
  { label: "On-Time Dispatch", value: "99.8%", icon: Truck },
  { label: "Insured & Tested", value: "100%", icon: ShieldCheck },
  { label: "Dedicated Support", value: "24/7", icon: Headphones },
]

export function WhyChooseUsSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200/70 dark:border-neutral-800/80">
      {/* Background Decorative Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-[#e77952]/5 blur-3xl dark:bg-[#e77952]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3.5 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3.5">
            <Sparkles className="size-3.5" />
            <span>Platform Advantages</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Why Choose Rentora for Your Equipment Rentals?
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We simplify heavy machinery and equipment rentals for builders,
            contractors, and creators. Experience transparent rates, certified
            fleets, and seamless digital booking designed for peace of mind.
          </p>
        </div>

        {/* 4 Core Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <div
                key={benefit.id}
                className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 ${benefit.borderColor} ${benefit.hoverShadow}`}
              >
                <div>
                  {/* Icon & Tagline */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl ${benefit.iconBg} ${benefit.iconColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="size-6" />
                    </div>

                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      {benefit.tagline}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-neutral-900 transition-colors group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372]">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Key Points */}
                <div className="mt-6 pt-5 border-t border-neutral-200/70 dark:border-neutral-800/80 space-y-2.5">
                  {benefit.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Trust & Stats Strip */}
        <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-neutral-50/80 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-neutral-200/80 dark:divide-neutral-800/80">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon

              return (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3.5 ${
                    idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""
                  }`}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e77952]/10 text-[#e77952] dark:bg-[#e77952]/20 dark:text-[#f49372]">
                    <StatIcon className="size-5.5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick CTA banner */}
          <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Have machinery sitting idle or need equipment tomorrow?
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Join thousands of builders and owners on Rentora today.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/equipment" className="w-full sm:w-auto">
                <Button
                  variant="brand"
                  size="sm"
                  className="h-10 px-4.5 rounded-xl font-semibold shadow-xs hover:shadow transition-all w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Explore Equipment</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
