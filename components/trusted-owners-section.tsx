"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Boxes,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  PlusCircle,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FleetOwner {
  id: string
  name: string
  company: string
  specialization: string
  avatar: string
  fleetSize: string
  rating: number
  totalRentals: string
  responseRate: string
  location: string
  featuredGear: string[]
  ownerEmail?: string
}

const verifiedOwners: FleetOwner[] = [
  {
    id: "owner-1",
    name: "Md. Tamim Khan",
    company: "Khan Heavy Machinery Depot",
    specialization: "Earthmoving & Excavation Fleet",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    fleetSize: "15+ Heavy Machines",
    rating: 4.95,
    totalRentals: "280+ Completed",
    responseRate: "< 10 min response",
    location: "Houston & Dallas, TX",
    featuredGear: ["Cat 320 GC Excavator", "Komatsu D65EX Dozer", "F-750 Flatbed"],
    ownerEmail: "tamimkhan87@gmail.com",
  },
  {
    id: "owner-2",
    name: "Afrin Sinthiya",
    company: "Sinthiya Cine & Fleet Solutions",
    specialization: "Cinema Production & Logistics Fleet",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    fleetSize: "18+ Premium Packages",
    rating: 4.98,
    totalRentals: "340+ Completed",
    responseRate: "< 15 min response",
    location: "Los Angeles & Phoenix, AZ",
    featuredGear: ["RED V-Raptor 8K", "Sprinter 2500 Van", "JBL VTX Audio"],
    ownerEmail: "afrinsinthiya58@gmail.com",
  },
  {
    id: "owner-3",
    name: "Apex Infrastructure Fleet",
    company: "Apex Rigging & Crane Operations",
    specialization: "Heavy Lifting & Mobile Cranes",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    fleetSize: "24+ Industrial Units",
    rating: 4.92,
    totalRentals: "190+ Completed",
    responseRate: "< 25 min response",
    location: "Chicago, IL & Atlanta, GA",
    featuredGear: ["Liebherr 11200 Crane", "Cat CB10 Roller", "Atlas Air Compressors"],
  },
  {
    id: "owner-4",
    name: "LoneStar Agro Network",
    company: "LoneStar Farm Machinery Co.",
    specialization: "High-Horsepower Agricultural Gear",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    fleetSize: "12+ Heavy Tractors",
    rating: 4.96,
    totalRentals: "210+ Completed",
    responseRate: "< 20 min response",
    location: "San Antonio & Austin, TX",
    featuredGear: ["John Deere 8R 410", "Kubota M7-172 Tractor", "Tillage Planters"],
  },
]

export function TrustedOwnersSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200/70 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3">
              <ShieldCheck className="size-3.5" />
              <span>Vetted Fleet Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Trusted Equipment Fleet Owners
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Partnered with verified equipment owners, certified commercial rental houses,
              and fleet operators with proven maintenance and safety track records.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e77952] hover:text-[#d86b44] dark:text-[#f49372] transition-colors group"
          >
            <span>Browse All Fleets</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* 4 Owners Grid */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {verifiedOwners.map((owner) => (
            <motion.div
              key={owner.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-7 shadow-xs transition-all duration-300 hover:bg-white hover:border-[#e77952]/40 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
            >
              <div>
                {/* Header: Avatar, Verified Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative size-14 overflow-hidden rounded-2xl border-2 border-white shadow-md dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={owner.avatar}
                      alt={owner.name}
                      fill
                      sizes="56px"
                      className="object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <CheckCircle2 className="size-3" />
                    <span>Verified Owner</span>
                  </span>
                </div>

                {/* Owner Name & Company */}
                <h3 className="text-lg font-bold text-neutral-900 transition-colors group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372]">
                  {owner.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {owner.company}
                </p>

                {/* Specialization Tag */}
                <div className="mt-2.5 inline-block rounded-md bg-[#e77952]/10 dark:bg-[#e77952]/20 px-2 py-0.5 text-[11px] font-semibold text-[#e77952] dark:text-[#f49372]">
                  {owner.specialization}
                </div>

                {/* Rating & Response Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-neutral-200/70 dark:border-neutral-800/80 text-xs">
                  <div>
                    <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-bold">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{owner.rating}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{owner.totalRentals}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-bold">
                      <Boxes className="size-3.5 text-[#e77952]" />
                      <span>{owner.fleetSize}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{owner.responseRate}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin className="size-3 text-[#e77952] shrink-0" />
                  <span className="truncate">{owner.location}</span>
                </div>

                {/* Sample Equipment Fleet Pills */}
                <div className="mt-3.5 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Popular In Fleet:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {owner.featuredGear.map((gear) => (
                      <span
                        key={gear}
                        className="rounded-md bg-white dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60"
                      >
                        {gear}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Fleet Button */}
              <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80">
                <Link
                  href={
                    owner.ownerEmail
                      ? `/equipment?ownerEmail=${encodeURIComponent(owner.ownerEmail)}`
                      : `/equipment`
                  }
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-xl text-xs font-semibold border-neutral-300 dark:border-neutral-700 group-hover:border-[#e77952] group-hover:text-[#e77952] dark:group-hover:text-[#f49372] transition-colors cursor-pointer"
                  >
                    <span>View Fleet Gear</span>
                    <ArrowRight className="size-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Owner Monetization Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl border border-[#e77952]/30 bg-gradient-to-r from-[#e77952]/10 via-amber-500/10 to-transparent p-6 sm:p-8 dark:border-[#e77952]/30 dark:bg-neutral-900/80 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e77952] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
              <Sparkles className="size-3" /> Owner Opportunity
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
              Own Heavy Equipment or Commercial Fleet?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Turn idle machinery into reliable recurring monthly revenue. List your equipment in minutes with verified contractors and 100% escrow protection.
            </p>
          </div>

          <Link href="/dashboard/owner/add-equipment" className="shrink-0">
            <Button
              variant="brand"
              className="h-11 px-6 rounded-xl font-semibold shadow-md shadow-[#e77952]/25 cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="size-4" />
              <span>List Your Machinery Today</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TrustedOwnersSection
