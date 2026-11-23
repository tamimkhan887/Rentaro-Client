"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  PartyPopper,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react"

export interface CategoryCardData {
  id: string
  name: string
  tagline: string
  description: string
  examples: string[]
  itemCount: string
  image: string
  icon: React.ComponentType<{ className?: string }>
  badgeColor: string
  accentBorder: string
  glowColor: string
}

export const categoryList: CategoryCardData[] = [
  {
    id: "construction",
    name: "Construction Equipment",
    tagline: "Heavy Machinery & Earthmoving",
    description:
      "Excavators, crawler bulldozers, mobile cranes, tandem rollers & concrete boom pumps.",
    examples: ["Excavators", "Bulldozers", "Cranes", "Rollers"],
    itemCount: "120+ Gear",
    image:
      "https://plus.unsplash.com/premium_photo-1681989490797-dbe51c438b61?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    icon: HardHat,
    badgeColor: "bg-[#e77952]/15 text-[#e77952] border-[#e77952]/30",
    accentBorder: "group-hover:border-[#e77952]/60",
    glowColor: "group-hover:shadow-[#e77952]/15",
  },
  {
    id: "photography",
    name: "Photography Equipment",
    tagline: "Cinema Cameras & Studio Lighting",
    description:
      "Full-frame 4K/8K cine cameras, prime lenses, wireless audio rigs, matte boxes & gimbals.",
    examples: ["Cinema Cameras", "Prime Lenses", "Gimbals", "Studio Lights"],
    itemCount: "85+ Gear",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    icon: Camera,
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    accentBorder: "group-hover:border-purple-500/60",
    glowColor: "group-hover:shadow-purple-500/15",
  },
  {
    id: "vehicles",
    name: "Vehicles & Transportation",
    tagline: "Commercial Haulers & Cargo Vans",
    description:
      "Heavy flatbed utility trucks, high-roof cargo vans, box trucks & equipment trailers.",
    examples: ["Flatbed Trucks", "Cargo Vans", "Box Trucks", "Trailers"],
    itemCount: "65+ Gear",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    icon: Truck,
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    accentBorder: "group-hover:border-blue-500/60",
    glowColor: "group-hover:shadow-blue-500/15",
  },
  {
    id: "agriculture",
    name: "Agriculture Equipment",
    tagline: "Row-Crop Tractors & Harvesters",
    description:
      "Heavy-duty farm tractors, tillage planters, grain combines & agricultural sprayers.",
    examples: ["Row-Crop Tractors", "Combines", "Seeders", "Tillage"],
    itemCount: "50+ Gear",
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    icon: Tractor,
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    accentBorder: "group-hover:border-emerald-500/60",
    glowColor: "group-hover:shadow-emerald-500/15",
  },
  {
    id: "electronics",
    name: "Electronics",
    tagline: "Post-Production Suites & Tech Gear",
    description:
      "High-power Mac Studio editing rigs, 6K Pro Display XDRs, DIT carts & field recorders.",
    examples: ["Pro Displays", "Mac Studios", "DIT Stations", "Recorders"],
    itemCount: "40+ Gear",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    icon: Cpu,
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    accentBorder: "group-hover:border-cyan-500/60",
    glowColor: "group-hover:shadow-cyan-500/15",
  },
  {
    id: "events",
    name: "Event Equipment",
    tagline: "Stage Audio, Trussing & Lighting",
    description:
      "Tour-grade line array sound systems, concert stage lighting, digital mixers & power distro.",
    examples: ["Line Arrays", "Stage Lighting", "Digital Mixers", "Power Distro"],
    itemCount: "55+ Gear",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    icon: PartyPopper,
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    accentBorder: "group-hover:border-rose-500/60",
    glowColor: "group-hover:shadow-rose-500/15",
  },
]

export function CategoriesSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-neutral-50/70 dark:bg-neutral-900/40 border-t border-neutral-200/70 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3">
              <Layers className="size-3.5" />
              <span>Equipment Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Explore Popular Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              From heavy-duty construction machinery to high-end cinema production
              gear, find certified equipment for any industry or project scale.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e77952] hover:text-[#d86b44] dark:text-[#f49372] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryList.map((category) => {
            const IconComponent = category.icon

            return (
              <div
                key={category.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90 ${category.accentBorder} ${category.glowColor}`}
              >
                {/* Background Image with Overlay */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-neutral-800 mb-5">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

                  {/* Top Floating Badge & Icon */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div
                      className={`flex size-9 items-center justify-center rounded-xl border backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-110 ${category.badgeColor}`}
                    >
                      <IconComponent className="size-4.5" />
                    </div>

                    <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      {category.itemCount}
                    </span>
                  </div>

                  {/* Tagline on image bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-medium text-neutral-300">
                      {category.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    {/* Category Name */}
                    <h3 className="text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372]">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Example Equipment Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {category.examples.map((ex) => (
                        <span
                          key={ex}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default CategoriesSection
