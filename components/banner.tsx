"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ShieldCheck,
  HardHat,
  Search,
  MapPin,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  Star,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const popularCategories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
]

export function Banner() {
  const router = useRouter()
  const [searchCategory, setSearchCategory] = React.useState("")
  const [searchLocation, setSearchLocation] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchCategory) params.append("category", searchCategory)
    if (searchLocation) params.append("location", searchLocation)
    router.push(`/equipment?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-neutral-50 via-white to-neutral-50/50 py-12 sm:py-16 md:py-20 lg:py-24 dark:from-neutral-950 dark:via-neutral-900/60 dark:to-neutral-950">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#e77952]/10 blur-3xl sm:h-112.5 sm:w-137.5 dark:bg-[#e77952]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1  items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Hero Copy & Value Proposition */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-7 order-2 lg:order-1">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3.5 py-1.5 text-xs font-semibold text-[#e77952] transition-colors dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372]">
              <Sparkles className="size-3.5 animate-pulse text-[#e77952]" />
              <span>Next-Gen Heavy Equipment Rental Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white leading-[1.12]">
              Rent Heavy Machinery &amp; Equipment{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-t from-[#e77952] via-[#e86639] to-amber-600 dark:from-[#f49372] dark:to-amber-400">
                On Demand.
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#e77952]/30"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 9.5C80 3.5 220 3.5 297.5 9.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description Explaining Platform Purpose */}
            <p className="max-w-2xl text-base text-neutral-600 sm:text-lg md:text-xl dark:text-neutral-300 font-normal leading-relaxed">
              Rentora bridges the gap between contractors and equipment fleet owners.
              Discover, book, and deploy certified excavators, cranes, loaders,
              and industrial power units with transparent daily, weekly, or monthly
              rates — fully inspected, insured, and delivered straight to your jobsite.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link href="/equipment" className="group">
                <Button
                  variant="brand"
                  className="h-12 w-full sm:w-auto px-6 text-base font-semibold shadow-md shadow-[#e77952]/25 hover:shadow-lg hover:shadow-[#e77952]/30 transition-all rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Browse All Equipment</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    100% Insured
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Field-tested &amp; safe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e77952]/10 text-[#e77952] dark:bg-[#e77952]/20 dark:text-[#f49372]">
                  <HardHat className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Verified Owners
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Vetted heavy fleets
                  </p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Fast Delivery
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Direct to your jobsite
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Visual Showcase */}
          <div className="relative lg:col-span-5 order-1 lg:order-2">
            {/* Ambient Background Box / Decorative Elements */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-neutral-100 shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-900">
                {/* Main High-Quality Equipment Image */}
                <div className="relative aspect-4/3 sm:aspect-16/11 w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1618347191821-51285853505f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                    alt="Heavy Excavators and Construction Machinery on Jobsite"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />

                  {/* Gradient Overlay for visual polish */}
                  <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e77952]/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wider sm:mb-8.5">
                      <TrendingUp className="size-3" /> Most Popular
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top-Right Glassmorphism Card */}
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:border-neutral-800/80 dark:bg-neutral-900/95">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Instant Booking
                    </span>
                    <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    From $150 / day
                  </p>
                </div>
              </div>

              {/* Floating Badge 2: Bottom-Left Glassmorphism Card */}
              <div className="absolute -bottom-5 -left-2 sm:-bottom-6 sm:-left-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:border-neutral-800/80 dark:bg-neutral-900/95">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#e77952]/15 text-[#e77952]">
                  <Star className="size-5 fill-[#e77952] text-[#e77952]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    4.9 / 5 Rating
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Trusted by 1,200+ Builders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Banner
