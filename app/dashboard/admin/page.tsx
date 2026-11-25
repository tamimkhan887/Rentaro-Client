"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Users,
  Boxes,
  ClipboardList,
  UserCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  HardHat,
  Search,
  ArrowRight,
  ExternalLink,
  Loader2,
  RefreshCw,
  Package,
  Calendar,
  Layers,
  Sparkles,
  CreditCard,
  Mail,
  User,
  AlertTriangle,
} from "lucide-react"

import { Equipment, Booking } from "@/types/equipment"
import { UserItem, getAllUsers } from "@/lib/api/user"
import { getAllAdminEquipments } from "@/lib/api/adminEquipment"
import { getAllBookings } from "@/lib/api/bookings"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const adminUser = session?.user

  const [users, setUsers] = React.useState<UserItem[]>([])
  const [equipments, setEquipments] = React.useState<Equipment[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Chart Metric View Mode: "bookings" | "revenue"
  const [chartMode, setChartMode] = React.useState<"bookings" | "revenue">("bookings")

  // Fetch all collections data simultaneously
  const loadAdminData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [usersData, equipmentsData, bookingsData] = await Promise.all([
        getAllUsers(),
        getAllAdminEquipments(),
        getAllBookings(),
      ])

      setUsers(usersData || [])
      setEquipments(equipmentsData || [])
      setBookings(bookingsData || [])
    } catch (err) {
      console.error("Error loading admin dashboard analytics:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (sessionLoading) return
    loadAdminData()
  }, [sessionLoading, loadAdminData])

  // ==========================================
  // ADMIN ANALYTICS CALCULATIONS
  // ==========================================
  const analytics = React.useMemo(() => {
    // 1. Users Analytics
    const totalUsers = users.length
    const customerCount = users.filter((u) => {
      const r = (u.role || "").toLowerCase()
      return r === "customer" || !r
    }).length
    const ownerCount = users.filter((u) => (u.role || "").toLowerCase() === "owner").length
    const adminCount = users.filter((u) => (u.role || "").toLowerCase() === "admin").length

    // 2. Equipment Analytics
    const totalEquipment = equipments.length
    const approvedEquipments = equipments.filter(
      (e) => (e.status || "").toLowerCase() === "approved"
    ).length
    const pendingApprovals = equipments.filter(
      (e) => (e.status || "pending").toLowerCase() === "pending"
    ).length
    const rejectedEquipments = equipments.filter(
      (e) => (e.status || "").toLowerCase() === "rejected"
    ).length
    const totalFleetUnits = equipments.reduce(
      (sum, e) => sum + (Number(e.quantity) || 0),
      0
    )

    // 3. Bookings Analytics
    const totalBookings = bookings.length
    const completedRentals = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "completed"
    ).length
    const confirmedBookings = bookings.filter(
      (b) =>
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "in transit" ||
        b.paymentStatus === "Paid"
    ).length
    const pendingBookings = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "pending" && b.paymentStatus !== "Paid"
    ).length
    const cancelledBookings = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "cancelled"
    ).length

    // 4. Total Revenue (Paid Bookings)
    const totalRevenue = bookings.reduce((sum, b) => {
      const isPaid =
        b.paymentStatus === "Paid" ||
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "completed"
      return isPaid ? sum + (Number(b.totalPrice) || 0) : sum
    }, 0)

    const avgBookingValue =
      totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

    // 5. Monthly Booking Statistics (Past 6 months)
    const now = new Date()
    const currentMonthIndex = now.getMonth()
    const currentYear = now.getFullYear()
    const currentMonthName = now.toLocaleString("en-US", { month: "long" })

    let currentMonthBookings = 0
    let currentMonthRevenue = 0

    const monthlyStats: {
      month: string
      year: number
      bookingsCount: number
      revenue: number
    }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthlyStats.push({
        month: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        bookingsCount: 0,
        revenue: 0,
      })
    }

    bookings.forEach((b) => {
      const dateStr = b.createdAt || b.paidAt || b.startDate
      const bDate = dateStr ? new Date(dateStr) : now

      if (bDate.getMonth() === currentMonthIndex && bDate.getFullYear() === currentYear) {
        currentMonthBookings += 1
        const isPaid =
          b.paymentStatus === "Paid" ||
          (b.status || "").toLowerCase() === "confirmed" ||
          (b.status || "").toLowerCase() === "completed"
        if (isPaid) {
          currentMonthRevenue += Number(b.totalPrice) || 0
        }
      }

      const mLabel = bDate.toLocaleString("en-US", { month: "short" })
      const mYear = bDate.getFullYear()
      const found = monthlyStats.find((s) => s.month === mLabel && s.year === mYear)
      if (found) {
        found.bookingsCount += 1
        const isPaid =
          b.paymentStatus === "Paid" ||
          (b.status || "").toLowerCase() === "confirmed" ||
          (b.status || "").toLowerCase() === "completed"
        if (isPaid) {
          found.revenue += Number(b.totalPrice) || 0
        }
      }
    })

    const maxMonthlyBookings = Math.max(...monthlyStats.map((s) => s.bookingsCount), 1)
    const maxMonthlyRevenue = Math.max(...monthlyStats.map((s) => s.revenue), 1)

    // 6. Category breakdown
    const categoryMap: Record<string, number> = {}
    equipments.forEach((e) => {
      const cat = e.category || "General Equipment"
      categoryMap[cat] = (categoryMap[cat] || 0) + 1
    })

    const categoryList = Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalEquipment > 0 ? Math.round((count / totalEquipment) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      totalUsers,
      customerCount,
      ownerCount,
      adminCount,
      totalEquipment,
      approvedEquipments,
      pendingApprovals,
      rejectedEquipments,
      totalFleetUnits,
      totalBookings,
      completedRentals,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      avgBookingValue,
      currentMonthBookings,
      currentMonthRevenue,
      currentMonthName,
      currentYear,
      monthlyStats,
      maxMonthlyBookings,
      maxMonthlyRevenue,
      categoryList,
    }
  }, [users, equipments, bookings])

  // Dynamic greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <div className="space-y-8">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-500/10 via-card to-orange-500/5 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldCheck className="size-3.5" />
              <span>Platform Root Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {greeting}, {adminUser?.name || "Administrator"}! ⚡
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Rentora Platform Command Center. Real-time metrics aggregated across users, machinery listings, customer bookings, and Stripe payment transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Metrics</span>
            </Button>
            <Link href="/dashboard/admin/all-equipment">
              <Button size="sm" className="gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-xs font-semibold">
                <Boxes className="size-4" />
                <span>Manage Fleet</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/all-users">
              <Button size="sm" variant="secondary" className="gap-2">
                <Users className="size-4" />
                <span>Users ({analytics.totalUsers})</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* PENDING APPROVALS ALERT BAR */}
      {analytics.pendingApprovals > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Action Required: {analytics.pendingApprovals} Equipment Listing{analytics.pendingApprovals !== 1 ? "s" : ""} Pending Review
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Owners have submitted machinery for verification. Inspect specifications and approve or reject listings.
              </p>
            </div>
          </div>

          <Link href="/dashboard/admin/all-equipment?status=Pending" className="shrink-0">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5 shadow-xs">
              <span>Review Pending Equipment</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* PRIMARY ADMIN METRICS (6 KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Users */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Users
              </span>
              <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-5 animate-spin text-blue-500" /> : analytics.totalUsers}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {analytics.customerCount} Customers • {analytics.ownerCount} Owners
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Equipment */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Equipment
              </span>
              <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Boxes className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-5 animate-spin text-amber-600" /> : analytics.totalEquipment}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {analytics.approvedEquipments} Approved • {analytics.totalFleetUnits} units
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Pending Approvals */}
        <Card className="border border-border/80 shadow-xs hover:border-amber-500/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Approvals
              </span>
              <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {isLoading ? <Loader2 className="size-5 animate-spin text-amber-600" /> : analytics.pendingApprovals}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Awaiting moderator review
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Total Bookings */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="size-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <ClipboardList className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-5 animate-spin text-purple-500" /> : analytics.totalBookings}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {analytics.confirmedBookings} Active/Confirmed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 5: Completed Rentals */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Completed Rentals
              </span>
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-5 animate-spin text-emerald-500" /> : analytics.completedRentals}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-3.5" />
                <span>Returned & Settled</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 6: Total Platform Revenue */}
        <Card className="border border-border/80 shadow-xs hover:border-[#635BFF]/40 transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="size-9 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <DollarSign className="size-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin text-[#635BFF]" />
                ) : (
                  `$${analytics.totalRevenue.toLocaleString()}`
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 truncate" title="Stripe Verified Payments">
                Stripe Verified
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MONTHLY BOOKING STATISTICS & ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Monthly Booking Statistics (2 cols) */}
        <Card className="lg:col-span-2 border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="size-5 text-rose-600" />
                  <span>Monthly Booking Statistics</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly platform rental activity and financial volume over the past 6 months.
                </CardDescription>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-medium shrink-0">
                <button
                  type="button"
                  onClick={() => setChartMode("bookings")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    chartMode === "bookings"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Bookings Count
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode("revenue")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    chartMode === "revenue"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Rental Revenue ($)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-rose-600" />
              </div>
            ) : analytics.totalBookings === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl border-border/70">
                <BarChart3 className="size-10 text-muted-foreground mb-2 opacity-40" />
                <h4 className="text-sm font-bold text-foreground">No Platform Rental Data Available</h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Once customers reserve equipment across the platform, monthly booking metrics will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* SVG / CSS Bar Chart */}
                <div className="h-52 w-full flex items-end justify-between gap-3 sm:gap-6 pt-6 px-3">
                  {analytics.monthlyStats.map((stat, idx) => {
                    const isCurrent =
                      stat.month === analytics.currentMonthName.substring(0, 3) &&
                      stat.year === analytics.currentYear

                    const val = chartMode === "bookings" ? stat.bookingsCount : stat.revenue
                    const maxVal =
                      chartMode === "bookings" ? analytics.maxMonthlyBookings : analytics.maxMonthlyRevenue

                    const heightPercent =
                      val > 0 ? Math.max(14, Math.round((val / maxVal) * 100)) : 6

                    return (
                      <div
                        key={`${stat.month}-${stat.year}`}
                        className="flex-1 flex flex-col items-center h-full justify-end group"
                      >
                        {/* Hover Tooltip Value */}
                        <div className="text-[11px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold whitespace-nowrap">
                          {chartMode === "bookings" ? `${stat.bookingsCount} orders` : `$${stat.revenue.toLocaleString()}`}
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[48px] bg-muted/40 rounded-t-lg overflow-hidden flex items-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className={`w-full rounded-t-lg transition-all ${
                              isCurrent
                                ? "bg-rose-600 group-hover:bg-rose-500 shadow-xs"
                                : val > 0
                                ? "bg-rose-500/70 group-hover:bg-rose-500"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        </div>

                        {/* Month Label */}
                        <div className="mt-2 text-center">
                          <span
                            className={`text-xs block transition-colors ${
                              isCurrent
                                ? "font-bold text-rose-600 dark:text-rose-400"
                                : "text-muted-foreground group-hover:text-foreground font-medium"
                            }`}
                          >
                            {stat.month}
                          </span>
                          <span className="text-[10px] text-muted-foreground block -mt-0.5">
                            {chartMode === "bookings"
                              ? `$${stat.revenue.toLocaleString()}`
                              : `${stat.bookingsCount} bks`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-600" />
                      <span>Current Month ({analytics.currentMonthName})</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-500/70" />
                      <span>Historical Months</span>
                    </span>
                  </div>
                  <span>
                    Current Month: {analytics.currentMonthBookings} bookings (${analytics.currentMonthRevenue.toLocaleString()})
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Ratios: Users & Equipment Distribution (1 col) */}
        <Card className="border border-border/80 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="size-5 text-rose-600" />
              <span>Platform Composition</span>
            </CardTitle>
            <CardDescription className="text-xs">
              User community roles and equipment category distribution.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 space-y-6">
            {isLoading ? (
              <div className="h-56 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-rose-600" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* User Roles Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground uppercase tracking-wider">
                      User Roles
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {analytics.totalUsers} registered
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      {
                        label: "Customers",
                        count: analytics.customerCount,
                        color: "bg-blue-500",
                        pct: analytics.totalUsers > 0 ? Math.round((analytics.customerCount / analytics.totalUsers) * 100) : 0,
                      },
                      {
                        label: "Fleet Owners",
                        count: analytics.ownerCount,
                        color: "bg-amber-500",
                        pct: analytics.totalUsers > 0 ? Math.round((analytics.ownerCount / analytics.totalUsers) * 100) : 0,
                      },
                      {
                        label: "Admins",
                        count: analytics.adminCount,
                        color: "bg-rose-500",
                        pct: analytics.totalUsers > 0 ? Math.round((analytics.adminCount / analytics.totalUsers) * 100) : 0,
                      },
                    ].map((role) => (
                      <div key={role.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                            <span className={`size-2 rounded-full ${role.color}`} />
                            {role.label}
                          </span>
                          <span className="text-foreground font-semibold">
                            {role.count} ({role.pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${role.color} rounded-full`} style={{ width: `${role.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Status Ratio */}
                <div className="space-y-2 border-t border-border/60 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground uppercase tracking-wider">
                      Equipment Status
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {analytics.totalEquipment} machinery
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm block">
                        {analytics.approvedEquipments}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Approved</span>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm block">
                        {analytics.pendingApprovals}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Pending</span>
                    </div>

                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <span className="text-rose-600 font-extrabold text-sm block">
                        {analytics.rejectedEquipments}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Rejected</span>
                    </div>
                  </div>
                </div>

                {/* Top Categories */}
                {analytics.categoryList.length > 0 && (
                  <div className="space-y-1.5 border-t border-border/60 pt-4">
                    <span className="font-bold text-foreground uppercase tracking-wider text-[11px] block">
                      Top Equipment Categories
                    </span>
                    <div className="space-y-1 text-xs">
                      {analytics.categoryList.slice(0, 3).map((c) => (
                        <div key={c.name} className="flex justify-between text-muted-foreground">
                          <span className="truncate max-w-[160px]">{c.name}</span>
                          <span className="font-semibold text-foreground">{c.count} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT PLATFORM ACTIVITY: RECENT BOOKINGS & RECENT USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Customer Bookings */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ClipboardList className="size-4 text-rose-600" />
                  <span>Recent Platform Rentals</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest equipment reservations made by customers.
                </CardDescription>
              </div>
              <Link href="/dashboard/admin/all-rentals">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-600 hover:text-rose-700 gap-1">
                  <span>View All</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="pt-1">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="size-6 animate-spin text-rose-600 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No rental bookings recorded on the platform yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {bookings.slice(0, 4).map((b, idx) => {
                  const isPaid = b.paymentStatus === "Paid" || b.status === "Confirmed"
                  return (
                    <div key={b._id || b.id || idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative size-11 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                          {b.equipmentImage ? (
                            <Image
                              src={b.equipmentImage}
                              alt={b.equipmentName}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                              <Package className="size-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-foreground truncate" title={b.equipmentName}>
                            {b.equipmentName}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            By {b.userName || "Customer"} • {b.quantity} unit(s)
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {b.startDate} &rarr; {b.endDate}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-extrabold text-xs text-foreground">
                          ${b.totalPrice?.toLocaleString() || 0}
                        </div>
                        <div className="mt-0.5">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Recent Registered Users */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="size-4 text-blue-500" />
                  <span>Recent User Registrations</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Newly joined platform customers and equipment owners.
                </CardDescription>
              </div>
              <Link href="/dashboard/admin/all-users">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-500 hover:text-blue-600 gap-1">
                  <span>View All</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="pt-1">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="size-6 animate-spin text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No registered users in the database yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {users.slice(0, 4).map((u, idx) => {
                  const role = (u.role || "customer").toLowerCase()
                  const roleBadge =
                    role === "admin"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      : role === "owner"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"

                  return (
                    <div key={u._id || u.id || idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name ? u.name.charAt(0) : "U"}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-foreground truncate">
                            {u.name || "User"}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate" title={u.email}>
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${roleBadge}`}>
                          {role}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QUICK ADMIN COMMAND SHORTCUTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="size-5 text-rose-600" />
          <span>Platform Management Portals</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Manage Users",
              href: "/dashboard/admin/all-users",
              description: `View, search, and manage all ${analytics.totalUsers} registered customer, owner, and admin accounts.`,
              icon: Users,
              color: "text-blue-500 bg-blue-500/10",
              countLabel: `${analytics.totalUsers} accounts`,
            },
            {
              title: "All Equipment Fleet",
              href: "/dashboard/admin/all-equipment",
              description: `Approve pending submissions, reject non-compliant items, and edit machinery specs.`,
              icon: Boxes,
              color: "text-amber-600 bg-amber-500/10",
              countLabel: `${analytics.pendingApprovals} pending review`,
            },
            {
              title: "All Rental Orders",
              href: "/dashboard/admin/all-rentals",
              description: `Track platform-wide reservations, dispute escrows, and monitor delivery status.`,
              icon: ClipboardList,
              color: "text-purple-500 bg-purple-500/10",
              countLabel: `${analytics.totalBookings} orders placed`,
            },
            {
              title: "Admin System Profile",
              href: "/dashboard/admin/my-profile",
              description: `Manage administrator credentials, security privileges, and account settings.`,
              icon: User,
              color: "text-rose-500 bg-rose-500/10",
              countLabel: "Root Admin",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-rose-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`size-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      {item.countLabel}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Portal</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
