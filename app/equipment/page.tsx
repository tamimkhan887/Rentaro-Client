"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  DollarSign,
  Boxes,
  Sparkles,
  Layers,
  Wrench,
  Clock,
  Filter,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { getAllEquipments } from "@/lib/api/getAllEquipments"
import { Equipment } from "@/types/equipment"

// Categories
const CATEGORIES = [
  "All",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const

// Rental Types
const RENTAL_TYPES = [
  { value: "All", label: "All Rental Types" },
  { value: "Daily", label: "Daily Rate" },
  { value: "Weekly", label: "Weekly Rate" },
  { value: "Monthly", label: "Monthly Rate" },
]

// Availability Options
const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Availability" },
  { value: "available", label: "Available (In Stock)" },
  { value: "unavailable", label: "Unavailable (Out of Stock)" },
]

// Sorting Options
const SORT_OPTIONS = [
  { value: "recently_added", label: "Recently Added" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

// Category badge styling map
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

function EquipmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: session } = authClient.useSession()
  const user = session?.user

  // URL parameters initialization
  const initialCategory = searchParams.get("category") || "All"
  const initialLocation = searchParams.get("location") || ""
  const initialSearch = searchParams.get("search") || ""

  // State management for Search, Filters, and Sorting
  const [searchTerm, setSearchTerm] = React.useState(initialSearch)
  const [locationTerm, setLocationTerm] = React.useState(initialLocation)
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory)
  const [selectedRentalType, setSelectedRentalType] = React.useState<string>("All")
  const [minPrice, setMinPrice] = React.useState<string>("")
  const [maxPrice, setMaxPrice] = React.useState<string>("")
  const [availability, setAvailability] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("recently_added")

  // Mobile filters drawer open/close
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)

  // Equipment list & loading states
  const [equipments, setEquipments] = React.useState<Equipment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch equipments from Backend with full filtering, searching, and sorting
  const fetchEquipments = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const options = {
        status: "Approved", // Public page displays approved equipment
        search: searchTerm.trim() || undefined,
        location: locationTerm.trim() || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        rentalType: selectedRentalType !== "All" ? selectedRentalType : undefined,
        minPrice: minPrice !== "" ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        availability: availability !== "all" ? availability : undefined,
        sort: sortBy,
      }

      const data = await getAllEquipments(options)
      setEquipments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load equipment.")
    } finally {
      setLoading(false)
    }
  }, [
    searchTerm,
    locationTerm,
    selectedCategory,
    selectedRentalType,
    minPrice,
    maxPrice,
    availability,
    sortBy,
  ])

  // Trigger backend fetch whenever filter, search or sort options change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipments()
    }, 250) // small debounce for smooth search input

    return () => clearTimeout(timer)
  }, [fetchEquipments])

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setLocationTerm("")
    setSelectedCategory("All")
    setSelectedRentalType("All")
    setMinPrice("")
    setMaxPrice("")
    setAvailability("all")
    setSortBy("recently_added")
    router.replace("/equipment")
  }

  // Active filter count calculation
  const activeFiltersCount = [
    searchTerm !== "",
    locationTerm !== "",
    selectedCategory !== "All",
    selectedRentalType !== "All",
    minPrice !== "" || maxPrice !== "",
    availability !== "all",
  ].filter(Boolean).length

  // Handle View Details:
  // If not logged in -> redirect to /login?callbackUrl=/equipment/:id
  // If logged in -> redirect to /equipment/:id
  const handleViewDetails = (equipment: Equipment) => {
    const id = equipment._id || equipment.id
    if (!id) {
      toast.add({
        title: "Missing ID",
        description: "Equipment identifier not found.",
        type: "error",
      })
      return
    }

    const detailsUrl = `/equipment/${id}`

    if (!user) {
      toast.add({
        title: "Authentication Required",
        description: "Please log in to view equipment specifications and booking options.",
        type: "info",
      })
      router.push(`/login?callbackUrl=${encodeURIComponent(detailsUrl)}`)
    } else {
      router.push(detailsUrl)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 pb-20">
      {/* Top Banner / Breadcrumb Header */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 py-10 sm:py-14 dark:border-neutral-800 dark:from-neutral-900/90 dark:to-neutral-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#e77952]/10 blur-3xl dark:bg-[#e77952]/15"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e77952]/20 bg-[#e77952]/10 px-3 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/30 dark:bg-[#e77952]/15 dark:text-[#f49372]">
              <Sparkles className="size-3.5" />
              <span>Verified Equipment Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              All Equipment Fleet
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Browse, filter, and inspect certified machinery, production packages,
              and commercial vehicles approved for instant rental. Filter by location,
              category, price, and availability status.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter Toolbar & Controls */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* Row 1: Search Inputs (Name & Location) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search by Equipment Name */}
            <div className="md:col-span-6 relative">
              <label
                htmlFor="search-name"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Search by Equipment Name
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="search-name"
                  type="text"
                  placeholder="e.g. Caterpillar 320, Sony FX6, Tractor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:focus:bg-neutral-800"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search by Location */}
            <div className="md:col-span-4 relative">
              <label
                htmlFor="search-location"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Location (City / State)
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="search-location"
                  type="text"
                  placeholder="e.g. Houston, Dallas, Austin..."
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:focus:bg-neutral-800"
                />
                {locationTerm && (
                  <button
                    type="button"
                    onClick={() => setLocationTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2 relative">
              <label
                htmlFor="sort-by"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Sort By
              </label>
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-11 appearance-none rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-8 text-xs font-semibold text-neutral-900 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Secondary Filters (Category, Rental Type, Price Range, Availability) */}
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Equipment Category Filter */}
            <div className="lg:col-span-4 relative">
              <label
                htmlFor="filter-category"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Equipment Category
              </label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-8 text-xs font-semibold text-neutral-900 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Equipment Categories" : cat}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Rental Type Filter */}
            <div className="lg:col-span-3 relative">
              <label
                htmlFor="filter-rental-type"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Rental Type
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <select
                  id="filter-rental-type"
                  value={selectedRentalType}
                  onChange={(e) => setSelectedRentalType(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-8 text-xs font-semibold text-neutral-900 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                >
                  {RENTAL_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="lg:col-span-3 relative">
              <label
                htmlFor="filter-availability"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Availability Status
              </label>
              <div className="relative">
                <Boxes className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <select
                  id="filter-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-8 text-xs font-semibold text-neutral-900 focus:border-[#e77952] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e77952]/20 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                >
                  {AVAILABILITY_OPTIONS.map((av) => (
                    <option key={av.value} value={av.value}>
                      {av.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Price Range Filter (Min & Max) */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Price Range ($)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-2 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:border-[#e77952] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                />
                <span className="text-neutral-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-2 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:border-[#e77952] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Chips & Reset Row */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                Filter by Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#e77952] text-white font-semibold shadow-xs"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clear All Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset All Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="mt-6 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <p>
            Showing <span className="font-bold text-neutral-900 dark:text-white">{equipments.length}</span> approved equipment items
          </p>
          <div className="flex items-center gap-1">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Live Fleet Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Equipment Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 animate-pulse shadow-xs"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 mb-4" />
                <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800 mb-3" />
                <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
                <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="h-6 w-1/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-9 w-1/3 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
            <XCircle className="mx-auto size-10 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              Unable to load equipment
            </h3>
            <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
            <Button
              variant="outline"
              onClick={() => fetchEquipments()}
              className="mt-4 rounded-xl cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && equipments.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <Boxes className="mx-auto size-12 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              No Equipment Matches Your Criteria
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              We couldn&apos;t find any approved equipment matching your search filters. Try clearing your filters or adjusting your keywords.
            </p>
            <Button
              variant="brand"
              onClick={handleResetFilters}
              className="mt-5 rounded-xl cursor-pointer"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* 3-Column Equipment Cards Grid with Framer Motion */}
        {!loading && !error && equipments.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {equipments.map((item) => {
              const isAvailable = (item.quantity ?? 1) > 0
              const categoryBadgeClass =
                categoryColorMap[item.category] ||
                "bg-neutral-500/10 text-neutral-700 border-neutral-500/20 dark:bg-neutral-500/20 dark:text-neutral-300"

              return (
                <motion.div
                  key={item._id || item.id || item.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:border-[#e77952]/40 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-[#e77952]/50"
                >
                  {/* Card Media: Equipment Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for visual polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/20" />

                    {/* Top Badges (Category & Availability Status) */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md shadow-xs ${categoryBadgeClass}`}
                      >
                        <Tag className="size-3" />
                        <span>{item.category}</span>
                      </span>

                      {/* Availability Status Badge */}
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                          <CheckCircle2 className="size-3" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                          <XCircle className="size-3" />
                          <span>Out of Stock</span>
                        </span>
                      )}
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

                    {/* Equipment Name */}
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#e77952] dark:text-white dark:group-hover:text-[#f49372] transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Specifications Chips */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                      {item.condition && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          <Wrench className="size-3 text-neutral-400" />
                          <span className="truncate max-w-[130px]">{item.condition}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        <Boxes className="size-3 text-neutral-400" />
                        <span>{item.quantity ?? 0} in stock</span>
                      </span>
                    </div>

                    {/* Card Footer: Rental Price, Rental Type, and View Details Button */}
                    <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                            ${item.price}
                          </span>
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            / {item.rentalType || "Daily"}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Insured &amp; Verified
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
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function EquipmentShow() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="flex flex-col items-center gap-3">
            <div className="size-9 animate-spin rounded-full border-3 border-[#e77952] border-t-transparent" />
            <p className="text-xs font-semibold text-neutral-500">Loading Equipment Fleet...</p>
          </div>
        </div>
      }
    >
      <EquipmentContent />
    </React.Suspense>
  )
}
