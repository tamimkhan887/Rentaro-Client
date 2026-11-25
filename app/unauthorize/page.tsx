"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  Home,
  LayoutDashboard,
  Search,
  KeyRound,
  User,
  HardHat,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react"

import { useSession, authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UnauthorizePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user

  // Current user role
  const userRole = (user?.role || "customer").toLowerCase()

  // Determine correct dashboard URL for the current user
  const userDashboardUrl = React.useMemo(() => {
    if (!user) return "/login"
    if (userRole === "admin") return "/dashboard/admin"
    if (userRole === "owner") return "/dashboard/owner"
    return "/dashboard/customer"
  }, [user, userRole])

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      if (typeof window !== "undefined") {
        localStorage.removeItem("access-token")
      }
      router.push("/login")
    } catch {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Main Alert Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Card className="border border-border/80 shadow-lg overflow-hidden bg-card/95 backdrop-blur-sm">
            {/* Top Security Banner Stripe */}
            <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500" />

            <CardContent className="p-6 sm:p-10 space-y-8 text-center">
              {/* Icon & Status Pill */}
              <div className="space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="size-20 sm:size-24 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-xs">
                    <ShieldAlert className="size-10 sm:size-12" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-background">
                    <Lock className="size-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <KeyRound className="size-3.5" />
                    <span>403 • ACCESS RESTRICTED</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Access Denied
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    You do not have the required permissions to view this protected resource. Access to this page is restricted based on specific user roles.
                  </p>
                </div>
              </div>

              {/* Active Session Role Context */}
              {user && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">
                      Current Signed-In Account
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active Session
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Role:</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                          userRole === "admin"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            : userRole === "owner"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {userRole}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href={userDashboardUrl} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground font-semibold shadow-xs">
                    <LayoutDashboard className="size-4" />
                    <span>Go to My Dashboard</span>
                  </Button>
                </Link>

                <Link href="/equipment" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <Search className="size-4" />
                    <span>Browse Equipment</span>
                  </Button>
                </Link>

                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full sm:w-auto gap-2">
                    <Home className="size-4" />
                    <span>Home</span>
                  </Button>
                </Link>
              </div>

              {/* Security Guidance Breakdown */}
              <div className="pt-6 border-t border-border/60 text-left space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Why am I seeing this page?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-border/60 bg-card/60 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <HardHat className="size-4 text-amber-600" />
                      <span>Fleet Owner Features</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Managing machinery listings, fleet stock, and rental dispatch requires a verified Fleet Owner profile.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-card/60 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-rose-600" />
                      <span>Admin Management</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Approving equipment, reviewing user roles, and platform oversight requires Root Administrator privileges.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="size-3.5 text-primary" />
                    <span>Need different privileges? Contact your organization administrator.</span>
                  </span>

                  {user && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <LogOut className="size-3" />
                      <span>Sign in with another account</span>
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
