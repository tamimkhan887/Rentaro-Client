"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Boxes,
  ClipboardList,
  PlusCircle,
  Truck,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  HardHat,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardRouteItem {
  label: string
  href: string
  description: string
  icon: React.ElementType
}

interface DashboardDropdownProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
  isMobile?: boolean
  onNavigate?: () => void
  className?: string
}

export function DashboardDropdown({
  user,
  isMobile = false,
  onNavigate,
  className,
}: DashboardDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Normalize role safely
  const rawRole = (user?.role || "").toString().trim().toLowerCase()
  const role: "admin" | "owner" | "customer" =
    rawRole === "admin"
      ? "admin"
      : rawRole === "owner"
        ? "owner"
        : "customer"

  // Role-specific config and allowed routes
  const config = React.useMemo(() => {
    switch (role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          badgeLabel: "Administrator",
          badgeColor:
            "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/50 dark:text-rose-400",
          roleIcon: ShieldCheck,
          accentBg: "hover:border-rose-400/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
          routes: [
            {
              label: "All Users",
              href: "/dashboard/admin/all-users",
              description: "Manage accounts, roles, and platform permissions",
              icon: Users,
            },
            {
              label: "All Equipment",
              href: "/dashboard/admin/all-equipment",
              description: "Moderate and supervise fleet machinery listings",
              icon: Boxes,
            },
            {
              label: "All Rentals",
              href: "/dashboard/admin/all-rentals",
              description: "Monitor active bookings, dispatch logs, and orders",
              icon: ClipboardList,
            },
            {
              label: "My Profile",
              href: "/dashboard/admin/my-profile",
              description: "View and edit administrator profile credentials",
              icon: User,
            },
          ] as DashboardRouteItem[],
        }

      case "owner":
        return {
          title: "Owner Dashboard",
          badgeLabel: "Fleet Owner",
          badgeColor:
            "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/50 dark:text-amber-400",
          roleIcon: HardHat,
          accentBg: "hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
          routes: [
            {
              label: "Add Equipment",
              href: "/dashboard/owner/add-equipment",
              description: "Publish a new machine, excavator, or tool",
              icon: PlusCircle,
            },
            {
              label: "My Equipment",
              href: "/dashboard/owner/my-equipment",
              description: "View and update your active machinery listings",
              icon: Boxes,
            },
            {
              label: "My Equipment Rental",
              href: "/dashboard/owner/my-equipment-rental",
              description: "Track booked machinery and customer lease orders",
              icon: Truck,
            },
            {
              label: "My Profile",
              href: "/dashboard/owner/my-profile",
              description: "Manage business settings and payout preferences",
              icon: User,
            },
          ] as DashboardRouteItem[],
        }

      default:
        return {
          title: "Customer Dashboard",
          badgeLabel: "Customer",
          badgeColor:
            "bg-[#e77952]/10 text-[#e77952] border-[#e77952]/30 dark:border-[#e77952]/30",
          roleIcon: UserCheck,
          accentBg: "hover:border-[#e77952]/50 hover:bg-[#e77952]/5 dark:hover:bg-[#e77952]/10",
          routes: [
            {
              label: "My Rentals",
              href: "/dashboard/customer/my-rentals",
              description: "Review your equipment leases and rental history",
              icon: ShoppingBag,
            },
            {
              label: "Favorites",
              href: "/dashboard/customer/favorites",
              description: "Saved and shortlisted equipment for quick booking",
              icon: Heart,
            },
            {
              label: "Profile",
              href: "/dashboard/customer/profile",
              description: "Manage personal details and delivery addresses",
              icon: User,
            },
          ] as DashboardRouteItem[],
        }
    }
  }, [role])

  // Close dropdown on click outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleRouteClick = () => {
    setIsOpen(false)
    if (onNavigate) {
      onNavigate()
    }
  }

  const RoleIcon = config.roleIcon

  // Mobile View: Accordion style dropdown inside mobile menu
  if (isMobile) {
    return (
      <div className="w-full flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between p-3.5 text-left font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#e77952] text-white">
              <LayoutDashboard className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {config.title}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize">
                {config.badgeLabel} Routes ({config.routes.length})
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "size-4 text-neutral-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-2 space-y-1 bg-white dark:bg-neutral-900">
            {config.routes.map((route) => {
              const RouteIcon = route.icon
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={handleRouteClick}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#e77952]/10 text-[#e77952] font-semibold"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <RouteIcon className="size-4 shrink-0 text-neutral-500" />
                    <span>{route.label}</span>
                  </div>
                  <ChevronRight className="size-3.5 opacity-60" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Desktop View: Anchored Dropdown Menu
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-[#e77952] px-4 h-9.5 text-sm font-medium text-white shadow-xs hover:bg-[#d86b44] active:scale-[0.98] transition-all cursor-pointer select-none",
          className
        )}
      >
        <LayoutDashboard className="size-4" />
        <span>Dashboard</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200 opacity-80",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-2xl backdrop-blur-md z-50 p-2 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Header with User Info & Role Badge */}
          <div className="p-2.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-850/80 border border-neutral-100 dark:border-neutral-800 mb-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  config.badgeColor
                )}
              >
                <RoleIcon className="size-3.5" />
                <span>{config.badgeLabel}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                <Sparkles className="size-3 text-[#e77952]" />
                <span>Rentora Portal</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e77952]/15 text-[#e77952] font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name || "Authenticated User"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {user.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="px-2 py-1 flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              Allowed Routes
            </p>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              /{role}
            </span>
          </div>

          {/* List of Allowed Routes for Current Role */}
          <div className="space-y-1 mt-1">
            {config.routes.map((route) => {
              const RouteIcon = route.icon
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={handleRouteClick}
                  className={cn(
                    "group flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer",
                    isActive
                      ? "border-[#e77952] bg-[#e77952]/10 dark:bg-[#e77952]/15"
                      : cn(
                          "border-transparent bg-neutral-50/50 dark:bg-neutral-800/40",
                          config.accentBg
                        )
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-[#e77952] text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-[#e77952] group-hover:text-white"
                      )}
                    >
                      <RouteIcon className="size-4" />
                    </div>

                    <div className="text-left min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold truncate transition-colors",
                          isActive
                            ? "text-[#e77952]"
                            : "text-neutral-900 dark:text-neutral-100 group-hover:text-[#e77952]"
                        )}
                      >
                        {route.label}
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        {route.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0 transition-transform ml-2",
                      isActive
                        ? "text-[#e77952] translate-x-0.5"
                        : "text-neutral-400 group-hover:text-[#e77952] group-hover:translate-x-0.5"
                    )}
                  />
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 px-2 py-1 text-center">
            <span className="text-[10px] text-neutral-400">
              Select any route to navigate directly
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

