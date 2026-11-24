"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  ChevronRight,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

interface NavRoute {
  label: string
  href: string
  icon: React.ElementType
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const { data: session } = authClient.useSession()
  const user = session?.user

  // Derive active role from URL path first, fallback to session user role
  const activeRole: "admin" | "owner" | "customer" = React.useMemo(() => {
    if (pathname.startsWith("/dashboard/admin")) return "admin"
    if (pathname.startsWith("/dashboard/owner")) return "owner"
    if (pathname.startsWith("/dashboard/customer")) return "customer"
    const sessionRole = (user?.role || "").toLowerCase()
    if (sessionRole === "admin") return "admin"
    if (sessionRole === "owner") return "owner"
    return "customer"
  }, [pathname, user?.role])

  // Role-specific navigation routes
  const roleConfig = React.useMemo(() => {
    switch (activeRole) {
      case "admin":
        return {
          roleName: "Administrator",
          badgeColor:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
          icon: ShieldCheck,
          basePath: "/dashboard/admin",
          routes: [
            {
              label: "Overview",
              href: "/dashboard/admin",
              icon: LayoutDashboard,
            },
            {
              label: "All Users",
              href: "/dashboard/admin/all-users",
              icon: Users,
            },
            {
              label: "All Equipment",
              href: "/dashboard/admin/all-equipment",
              icon: Boxes,
            },
            {
              label: "All Rentals",
              href: "/dashboard/admin/all-rentals",
              icon: ClipboardList,
            },
            {
              label: "My Profile",
              href: "/dashboard/admin/my-profile",
              icon: User,
            },
          ] as NavRoute[],
        }

      case "owner":
        return {
          roleName: "Fleet Owner",
          badgeColor:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
          icon: HardHat,
          basePath: "/dashboard/owner",
          routes: [
            {
              label: "Overview",
              href: "/dashboard/owner",
              icon: LayoutDashboard,
            },
            {
              label: "Add Equipment",
              href: "/dashboard/owner/add-equipment",
              icon: PlusCircle,
            },
            {
              label: "My Equipment",
              href: "/dashboard/owner/my-equipment",
              icon: Boxes,
            },
            {
              label: "My Equipment Rental",
              href: "/dashboard/owner/my-equipment-rental",
              icon: Truck,
            },
            {
              label: "My Profile",
              href: "/dashboard/owner/my-profile",
              icon: User,
            },
          ] as NavRoute[],
        }

      default:
        return {
          roleName: "Customer",
          badgeColor:
            "bg-[#e77952]/10 text-[#e77952] border-[#e77952]/30 dark:border-[#e77952]/40",
          icon: UserCheck,
          basePath: "/dashboard/customer",
          routes: [
            {
              label: "Overview",
              href: "/dashboard/customer",
              icon: LayoutDashboard,
            },
            {
              label: "My Rentals",
              href: "/dashboard/customer/my-rentals",
              icon: ShoppingBag,
            },
            {
              label: "Favorites",
              href: "/dashboard/customer/favorites",
              icon: Heart,
            },
            {
              label: "Profile",
              href: "/dashboard/customer/profile",
              icon: User,
            },
          ] as NavRoute[],
        }
    }
  }, [activeRole])

  // Sign out handler
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await authClient.signOut()
      toast.add({
        title: "Signed Out",
        description: "You have been logged out successfully.",
        type: "success",
      })
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      toast.add({
        title: "Sign Out Error",
        description: err instanceof Error ? err.message : "Failed to sign out",
        type: "error",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  // Find active route label for breadcrumbs
  const currentRoute = roleConfig.routes.find((r) => r.href === pathname)
  const pageTitle = currentRoute ? currentRoute.label : "Dashboard"

  const RoleIcon = roleConfig.icon

  // Render Sidebar Content (shared between desktop sticky sidebar & mobile slide-over drawer)
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Top Section: User Card & Role Info */}
      <div className="space-y-4">
        {/* User Card */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 p-3.5 backdrop-blur-xs shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e77952]/15 text-[#e77952] font-bold text-base">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {user?.name || "Authenticated User"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80">
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                roleConfig.badgeColor
              )}
            >
              <RoleIcon className="size-3" />
              <span>{roleConfig.roleName}</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400">
              <Sparkles className="size-2.5 text-[#e77952]" />
              <span>Rentora</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            Navigation Menu
          </p>

          <nav className="space-y-1">
            {roleConfig.routes.map((route) => {
              const RouteIcon = route.icon
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-[#e77952] text-white shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RouteIcon
                      className={cn(
                        "size-4.5 shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                      )}
                    />
                    <span>{route.label}</span>
                  </div>

                  <ChevronRight
                    className={cn(
                      "size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all",
                      isActive && "opacity-90 translate-x-0.5"
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Website Link & Sign Out */}
      <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
        <Link
          href="/"
          onClick={() => setMobileSidebarOpen(false)}
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Home className="size-4 shrink-0 text-neutral-500" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" />
          <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#FDFBF9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="flex-1 flex w-full">
        {/* Desktop Left Sidebar (Sticky below main navbar) */}
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Slide-over panel */}
            <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Dashboard Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderSidebarContent()}
              </div>
            </div>
          </div>
        )}

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Subheader / Breadcrumbs bar */}
          <div className="sticky top-16 z-30 flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden inline-flex items-center justify-center size-9 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Open dashboard menu"
              >
                <Menu className="size-5" />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Link
                  href="/"
                  className="hover:text-[#e77952] transition-colors flex items-center gap-1"
                >
                  <Home className="size-3.5" />
                  <span className="hidden sm:inline">Rentora</span>
                </Link>
                <ChevronRight className="size-3 text-neutral-400" />
                <Link
                  href={roleConfig.basePath}
                  className="hover:text-[#e77952] transition-colors capitalize"
                >
                  {activeRole}
                </Link>
                <ChevronRight className="size-3 text-neutral-400" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {pageTitle}
                </span>
              </div>
            </div>

            {/* Right Subheader info */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  roleConfig.badgeColor
                )}
              >
                <RoleIcon className="size-3" />
                <span>{roleConfig.roleName}</span>
              </span>
            </div>
          </div>

          {/* Page Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
