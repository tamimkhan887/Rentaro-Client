import Link from "next/link"
import {
  HardHat,
  PlusCircle,
  Boxes,
  Truck,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function OwnerDashboardPage() {
  const routes = [
    {
      title: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      description: "List a new machine, excavator, crane, or tool with daily rental rates and availability.",
      icon: PlusCircle,
      badge: "Listings",
    },
    {
      title: "My Equipment",
      href: "/dashboard/owner/my-equipment",
      description: "View, edit specifications, update rates, and manage availability of your fleet machinery.",
      icon: Boxes,
      badge: "Fleet Management",
    },
    {
      title: "My Equipment Rental",
      href: "/dashboard/owner/my-equipment-rental",
      description: "Track incoming rental requests, active bookings, leases, returns, and client payments.",
      icon: Truck,
      badge: "Bookings & Orders",
    },
    {
      title: "My Profile",
      href: "/dashboard/owner/my-profile",
      description: "Manage your equipment business credentials, payout accounts, and contact details.",
      icon: User,
      badge: "Owner Account",
    },
  ]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-linear-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900/50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 mb-3">
              <HardHat className="size-3.5" />
              <span>Fleet Owner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Owner Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Manage your machinery listings, track customer rental orders, and monitor your fleet performance.
            </p>
          </div>
          <div className="shrink-0 hidden sm:flex items-center gap-1 text-xs text-neutral-500 font-mono bg-white/80 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <Sparkles className="size-3.5 text-[#e77952]" />
            <span>Role: Fleet Owner</span>
          </div>
        </div>
      </div>

      {/* Grid of Route Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {routes.map((route) => {
          const RouteIcon = route.icon
          return (
            <Link
              key={route.href}
              href={route.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-6 shadow-xs hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all cursor-pointer backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <RouteIcon className="size-5" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                    {route.badge}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {route.title}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {route.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Access {route.title}</span>
                <ArrowRight className="size-4" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
