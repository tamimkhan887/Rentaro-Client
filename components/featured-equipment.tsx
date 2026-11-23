"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Boxes,
  Eye,
  Layers,
  Wrench,
  ShieldCheck,
  Tag,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { getAllEquipments } from "@/lib/api/getAllEquipments"
import { Equipment } from "@/types/equipment"

interface FeaturedEquipmentProps {
  initialEquipments?: Equipment[]
}

// Category Badge Color Mapping
const categoryColorMap: Record<string, string> = {
  "Construction Equipment":
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
  "Photography Equipment":
    "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
  "Vehicles & Transportation":
    "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
  "Agriculture Equipment":
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
  "Electronics":
    "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",
  "Event Equipment":
    "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
}

export function FeaturedEquipment({ initialEquipments }: FeaturedEquipmentProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [equipments, setEquipments] = React.useState<Equipment[]>(
    initialEquipments || []
  )
  const [loading, setLoading] = React.useState(!initialEquipments || initialEquipments.length === 0)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch 6 approved equipment items using backend limit operator if not supplied via props
  React.useEffect(() => {
    let isMounted = true

    async function loadFeatured() {
      try {
        setLoading(true)
        setError(null)
        // Fetches from /equipments?status=Approved&limit=6
        const data = await getAllEquipments({ status: "Approved", limit: 6 })
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setEquipments(data)
          } else {
            // Fallback: if backend returned empty, fetch all and filter approved
            const fallbackAll = await getAllEquipments()
            const approved = fallbackAll.filter(
              (item) => (item.status || "").toLowerCase() === "approved"
            )
            setEquipments(approved.slice(0, 6))
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load featured equipment"
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (!initialEquipments || initialEquipments.length === 0) {
      loadFeatured()
    }

    return () => {
      isMounted = false
    }
  }, [initialEquipments])

  // Handle "View Details" click:
  // If user is not logged in -> redirect to /login
  // If user is logged in -> redirect to /equipment/:id
  const handleViewDetails = (equipment: Equipment) => {
    const id = equipment._id || equipment.id
    if (!id) {
      toast.add({
        title: "Invalid Item",
        description: "Equipment ID is missing.",
        type: "error",
      })
      return
    }

    const targetUrl = `/equipment/${id}`

    if (!user) {
      toast.add({
        title: "Login Required",
        description: "Please sign in to view complete equipment specifications and booking options.",
        type: "info",
      })
      // Redirect unauthenticated user to login with return callback
      router.push(`/login?callbackUrl=${encodeURIComponent(targetUrl)}`)
    } else {
      // Redirect logged in user to details page
      router.push(targetUrl)
    }
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200/70 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372] mb-3">
              <Sparkles className="size-3.5" />
              <span>Handpicked &amp; Certified Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Featured Equipment
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Explore our top-performing, field-tested machinery and professional gear
              approved for immediate rental. Insured and ready for fast deployment.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e77952] hover:text-[#d86b44] dark:text-[#f49372] transition-colors group"
          >
            <span>Explore All Equipment</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State / Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900 animate-pulse"
              >
                <div className="aspect-16/10 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 mb-4" />
                <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800 mb-3" />
                <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
                <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="h-6 w-1/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-9 w-1/3 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
            <AlertCircle className="mx-auto size-8 text-rose-500 mb-3" />
            <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">
              Unable to load featured equipment
            </h3>
            <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && equipments.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
            <Boxes className="mx-auto size-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              No Approved Equipment Available
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Check back soon as fleet owners add and verify new machinery daily.
            </p>
          </div>
        )}

        {/* 6 Equipment Cards Grid */}
        {!loading && !error && equipments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {equipments.slice(0, 6).map((item) => {
              const categoryBadgeClass =
                categoryColorMap[item.category] ||
                "bg-neutral-500/10 text-neutral-700 border-neutral-500/20 dark:bg-neutral-500/20 dark:text-neutral-300"

              return (
                <div
                  key={item._id || item.id || item.name}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#e77952]/40 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-[#e77952]/50"
                >
                  {/* Card Media Header */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 via-transparent to-neutral-950/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md ${categoryBadgeClass}`}
                      >
                        <Tag className="size-3" />
                        <span>{item.category}</span>
                      </span>

                      {/* Approved Status Badge */}
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md">
                        <CheckCircle2 className="size-3" />
                        <span>Approved</span>
                      </span>
                    </div>

                    {/* Bottom Image Overlay: Brand / Model tag */}
                    {(item.brand || item.model) && (
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium drop-shadow-md">
                        <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                          {[item.brand, item.model].filter(Boolean).join(" • ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                      <MapPin className="size-3.5 text-[#e77952] shrink-0" />
                      <span className="truncate">{item.location || "Available Nationwide"}</span>
                    </div>

                    {/* Equipment Title */}
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372] transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Description snippet */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Specifications Chips */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400">
                      {item.condition && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          <Wrench className="size-3 text-neutral-400" />
                          <span className="truncate max-w-32.5">{item.condition}</span>
                        </span>
                      )}
                      {item.quantity && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          <Boxes className="size-3 text-neutral-400" />
                          <span>{item.quantity} In Stock</span>
                        </span>
                      )}
                    </div>

                    {/* Card Footer: Price & Action */}
                    <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                            ${item.price}
                          </span>
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            / {item.rentalType || "Day"}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Best Rate Guaranteed
                        </span>
                      </div>

                      {/* View Details Button */}
                      <Button
                        type="button"
                        variant="brand"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                        className="h-10 px-4 rounded-xl font-semibold cursor-pointer shadow-xs hover:shadow transition-all flex items-center gap-1.5"
                      >
                        <Eye className="size-3.5" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
export default FeaturedEquipment
