
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"

export interface NavLinkItem {
  label: string
  href: string
  isActive?: boolean
}

interface NavbarProps {
  navLinks?: NavLinkItem[]
  className?: string
}

const defaultNavLinks: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
]

export function Navbar({
  navLinks = defaultNavLinks,
  className,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const { data: session } = authClient.useSession()
  const user = session?.user

  // Check active route
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Role-based dashboard destination
  const role = (user?.role || "").toLowerCase()

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "owner"
        ? "/dashboard/owner"
        : "/dashboard/customer"

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)

      await authClient.signOut()
      if (typeof window !== "undefined") {
        localStorage.removeItem("access-token")
      }

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
        description:
          err instanceof Error ? err.message : "Failed to sign out",
        type: "error",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/95 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/95 py-3",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            aria-label="Rentora Home"
          >
            <Image
              src="/Logo.png"
              alt="Rentora Logo"
              width={145}
              height={48}
              className="h-14 md:h-14 w-auto object-contain dark:hidden"
              priority
            />

            <Image
              src="/Logo-dark.png"
              alt="Rentora Logo"
              width={145}
              height={48}
              className="h-14 md:h-14 w-auto object-contain hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link.href)

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#e77952] dark:hover:text-[#e77952]",
                  active
                    ? "text-[#e77952] font-semibold"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">

              {/* Dashboard */}
              <Link href={dashboardHref}>
                <Button
                  variant="brand"
                  size="lg"
                  className="gap-2 rounded-lg px-4 h-9.5 text-sm font-medium shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* Sign Out */}
              <Button
                variant="ghost"
                size="lg"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="gap-1.5 text-neutral-700 hover:text-rose-600 hover:bg-rose-50 dark:text-neutral-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 font-medium text-sm px-3.5 h-9.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
                <span>
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">

              {/* Login */}
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:text-white dark:hover:bg-neutral-800 font-medium text-sm px-4 h-9.5 rounded-lg"
                >
                  Log In
                </Button>
              </Link>

              {/* Register */}
              <Link href="/register">
                <Button
                  variant="brand"
                  size="lg"
                  className="rounded-lg px-5 h-9.5 text-sm font-medium shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="size-9 rounded-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200/80 bg-white/95 px-4 pt-3 pb-6 shadow-lg backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/95 animate-in slide-in-from-top-2 duration-200">

          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => {
              const active = isLinkActive(link.href)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-base font-medium transition-colors",
                    active
                      ? "bg-neutral-100 text-[#e77952] font-semibold dark:bg-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-[#e77952] dark:text-neutral-300 dark:hover:bg-neutral-900/60"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Mobile Authentication Actions */}
            <div className="mt-4 flex flex-col gap-2.5 border-t border-neutral-200/70 pt-4 dark:border-neutral-800/70">

              {user ? (
                <>
                  {/* User Profile */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-100/80 dark:bg-neutral-900">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#e77952]/15 text-[#e77952] font-semibold text-sm">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {user.name || "Authenticated User"}
                      </p>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize">
                        {user.role || "Customer"} Account
                      </p>
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full justify-center gap-2 h-10 shadow-sm"
                    >
                      <LayoutDashboard className="size-4" />
                      <span>Open Dashboard</span>
                    </Button>
                  </Link>

                  {/* Sign Out */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    disabled={isSigningOut}
                    className="w-full justify-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 h-10"
                  >
                    <LogOut className="size-4" />
                    <span>
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-center text-neutral-800 dark:text-neutral-200 h-10"
                    >
                      Log In
                    </Button>
                  </Link>

                  {/* Register */}
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full justify-center h-10 shadow-sm"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
