"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react"

export interface CustomerReview {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  comment: string
  equipmentRented: string
  location: string
  date: string
}

export const reviews: CustomerReview[] = [
  {
    id: "review-1",
    name: "Marcus Vance",
    role: "Project Director",
    company: "Apex Infrastructure Group",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Renting a 20-ton Caterpillar excavator through Rentora saved us nearly 4 days of downtime on our highway bridge extension. The owner was responsive, the machine arrived fully inspected with maintenance logs, and the escrow payment gave us complete peace of mind.",
    equipmentRented: "Caterpillar 320 GC Excavator",
    location: "Houston, TX",
    date: "November 2026",
  },
  {
    id: "review-2",
    name: "Elena Rostova",
    role: "Lead Cinematographer",
    company: "Horizon Media Studios",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "We needed two full cinema kits for a 3-week commercial shoot on short notice. Rentora connected us with verified owners who provided pristine Sony FX6 bodies and GM prime lenses. Extending our rental duration by another week took literally one click.",
    equipmentRented: "Sony FX6 Cinema Camera Package",
    location: "Austin, TX",
    date: "November 2026",
  },
  {
    id: "review-3",
    name: "David Chen",
    role: "Operations Head",
    company: "LoneStar Agro Corp",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Finding reliable high-horsepower tractors during peak harvest season used to be a logistics nightmare. Through Rentora, we secured a John Deere 8R within 24 hours. Transparent daily pricing and verified machinery owners make this our go-to equipment platform.",
    equipmentRented: "John Deere 8R 410 Row-Crop Tractor",
    location: "San Antonio, TX",
    date: "October 2026",
  },
  {
    id: "review-4",
    name: "Sarah Jenkins",
    role: "Festival Director",
    company: "Austin Live Productions",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The JBL VTX line array sound system and touring concert lighting we rented performed flawlessly for our 3-day outdoor music festival. The booking process was fast, equipment was delivered directly to our venue grounds, and customer support was exceptional.",
    equipmentRented: "JBL VTX A8 Audio & Stage Lighting",
    location: "Miami, FL",
    date: "November 2026",
  },
]

export function CustomerReviewsSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-neutral-50/70 dark:bg-neutral-900/40 border-t border-neutral-200/70 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 sm:mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3">
              <Sparkles className="size-3.5" />
              <span>Customer Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Trusted by Builders, Contractors &amp; Creators
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Discover how Rentora helps project managers, fleet operators, and production teams deploy certified equipment on time and on budget.
            </p>
          </div>

          {/* Overall Rating Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 shrink-0">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
              <Star className="size-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-neutral-900 dark:text-white">
                  4.9
                </span>
                <span className="text-xs text-neutral-400">/ 5.0</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                Based on 1,200+ verified rentals
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4 Reviews Cards Grid with Framer Motion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-[#e77952]/40 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-[#e77952]/50"
            >
              <div>
                {/* Top Card: Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Star Rating Display */}
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`Rating: ${rev.rating} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Verified Renter Tag */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    <CheckCircle2 className="size-3" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Rented Equipment Chip */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 max-w-full">
                  <Tag className="size-3 text-[#e77952] shrink-0" />
                  <span className="truncate">{rev.equipmentRented}</span>
                </div>
              </div>

              {/* Customer Info (Avatar, Name, Role, Location) */}
              <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={rev.avatar}
                    alt={rev.name}
                    fill
                    sizes="44px"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {rev.role} • {rev.company}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    <MapPin className="size-2.5 text-[#e77952]" />
                    <span>{rev.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CustomerReviewsSection
