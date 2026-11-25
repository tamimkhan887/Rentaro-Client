"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  HardHat,
  Boxes,
  PlusCircle,
  Truck,
  User,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Loader2,
  BarChart3,
  PieChart,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Award,
} from "lucide-react"

import { Equipment, Booking } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { getOwnerEquipments } from "@/lib/api/ownerEquipment"
import { getOwnerBookings } from "@/lib/api/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OwnerDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const user = session?.user

  const [equipments, setEquipments] = React.useState<Equipment[]>([])
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Fetch owner data (both equipments and bookings)
  const loadOwnerData = React.useCallback(async () => {
    const ownerEmail = user?.email
    if (!ownerEmail) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const [eqData, bkData] = await Promise.all([
        getOwnerEquipments(ownerEmail),
        getOwnerBookings(ownerEmail),
      ])

      setEquipments(eqData || [])
      setBookings(bkData || [])
    } catch (err) {
      console.error("Error loading owner dashboard data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  React.useEffect(() => {
    if (sessionLoading) return
    loadOwnerData()
  }, [sessionLoading, loadOwnerData])

  // ==========================================
  // OWNER ANALYTICS CALCULATIONS
  // ==========================================
  const analytics = React.useMemo(() => {
    const totalListedEquipment = equipments.length
    const approvedEquipmentCount = equipments.filter(
      (e) => (e.status || "").toLowerCase() === "approved"
    ).length
    const pendingEquipmentCount = equipments.filter(
      (e) => (e.status || "").toLowerCase() === "pending"
    ).length

    // Total units in fleet (sum of available quantity)
    const totalFleetUnits = equipments.reduce(
      (sum, e) => sum + (Number(e.quantity) || 0),
      0
    )

    // Rental counts
    const completedRentals = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "completed"
    ).length

    const activeRentals = bookings.filter(
      (b) =>
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "in transit" ||
        b.paymentStatus === "Paid"
    ).length

    // Total Earnings from paid/confirmed bookings
    const totalEarnings = bookings.reduce((sum, b) => {
      const isPaid =
        b.paymentStatus === "Paid" ||
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "completed"
      return isPaid ? sum + (Number(b.totalPrice) || 0) : sum
    }, 0)

    const avgEarningsPerRental =
      bookings.length > 0 ? Math.round(totalEarnings / bookings.length) : 0

    // Monthly Earnings Breakdown (past 6 months + current month)
    const now = new Date()
    const currentMonthIndex = now.getMonth()
    const currentYear = now.getFullYear()
    const currentMonthName = now.toLocaleString("en-US", { month: "long" })

    let currentMonthEarnings = 0
    let currentMonthOrderCount = 0

    let prevMonthEarnings = 0

    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonthIndex = prevMonthDate.getMonth()
    const prevMonthYear = prevMonthDate.getFullYear()

    // Setup past 6 months list
    const monthlyStats: { month: string; year: number; earnings: number; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mLabel = d.toLocaleString("en-US", { month: "short" })
      monthlyStats.push({
        month: mLabel,
        year: d.getFullYear(),
        earnings: 0,
        count: 0,
      })
    }

    bookings.forEach((b) => {
      const isPaid =
        b.paymentStatus === "Paid" ||
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "completed"
      if (!isPaid) return

      const price = Number(b.totalPrice) || 0
      const dateStr = b.paidAt || b.createdAt
      const bDate = dateStr ? new Date(dateStr) : now

      // Check current month
      if (bDate.getMonth() === currentMonthIndex && bDate.getFullYear() === currentYear) {
        currentMonthEarnings += price
        currentMonthOrderCount += 1
      }

      // Check previous month
      if (bDate.getMonth() === prevMonthIndex && bDate.getFullYear() === prevMonthYear) {
        prevMonthEarnings += price
      }

      // Populate 6 months chart
      const mLabel = bDate.toLocaleString("en-US", { month: "short" })
      const mYear = bDate.getFullYear()
      const found = monthlyStats.find((s) => s.month === mLabel && s.year === mYear)
      if (found) {
        found.earnings += price
        found.count += 1
      }
    })

    const maxMonthlyEarnings = Math.max(...monthlyStats.map((s) => s.earnings), 1)

    // Month over month growth %
    let momGrowth: number | null = null
    if (prevMonthEarnings > 0) {
      momGrowth = Math.round(((currentMonthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100)
    }

    // Category breakdown
    const categoryCounts: Record<string, { count: number; earnings: number }> = {}
    equipments.forEach((e) => {
      const cat = e.category || "General Equipment"
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, earnings: 0 }
      }
      categoryCounts[cat].count += 1
    })

    bookings.forEach((b) => {
      const isPaid =
        b.paymentStatus === "Paid" ||
        (b.status || "").toLowerCase() === "confirmed" ||
        (b.status || "").toLowerCase() === "completed"
      if (!isPaid) return

      // Find matching equipment
      const matched = equipments.find((e) => (e._id || e.id) === b.equipmentId)
      const cat = matched?.category || "Industrial Equipment"
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, earnings: 0 }
      }
      categoryCounts[cat].earnings += Number(b.totalPrice) || 0
    })

    const categoryList = Object.entries(categoryCounts).map(([cat, val]) => ({
      category: cat,
      count: val.count,
      earnings: val.earnings,
      percentage: totalListedEquipment > 0 ? Math.round((val.count / totalListedEquipment) * 100) : 0,
    }))

    // Fleet utilization rate: deployed units vs total units
    const currentlyDeployedUnits = bookings
      .filter((b) => (b.status || "").toLowerCase() === "confirmed" || (b.status || "").toLowerCase() === "in transit")
      .reduce((sum, b) => sum + (Number(b.quantity) || 1), 0)

    const totalFleetCapacity = totalFleetUnits + currentlyDeployedUnits
    const utilizationRate =
      totalFleetCapacity > 0 ? Math.round((currentlyDeployedUnits / totalFleetCapacity) * 100) : 0

    return {
      totalListedEquipment,
      approvedEquipmentCount,
      pendingEquipmentCount,
      totalFleetUnits,
      completedRentals,
      activeRentals,
      totalEarnings,
      avgEarningsPerRental,
      currentMonthEarnings,
      currentMonthName,
      currentYear,
      currentMonthOrderCount,
      prevMonthEarnings,
      momGrowth,
      monthlyStats,
      maxMonthlyEarnings,
      categoryList,
      currentlyDeployedUnits,
      utilizationRate,
    }
  }, [equipments, bookings])

  // Greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-500/10 via-card to-orange-500/5 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <HardHat className="size-3.5" />
              <span>Fleet Owner Executive Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {greeting}, {user?.name || "Fleet Owner"}! 🏗️
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Track your machinery listings, calculate live revenue, review completed customer rentals, and monitor monthly earnings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadOwnerData}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Link href="/dashboard/owner/add-equipment">
              <Button size="sm" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-xs font-semibold">
                <PlusCircle className="size-4" />
                <span>Add Equipment</span>
              </Button>
            </Link>
            <Link href="/dashboard/owner/my-equipment-rental">
              <Button size="sm" variant="secondary" className="gap-2">
                <Truck className="size-4" />
                <span>Rental Orders</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* CORE OWNER ANALYTICS: 4 KEY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Listed Equipment */}
        <Card className="border border-border/80 shadow-xs hover:border-amber-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Listed Equipment
              </span>
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Boxes className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-amber-600" />
                ) : (
                  analytics.totalListedEquipment
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {analytics.approvedEquipmentCount} Approved
                </span>
                <span>• {analytics.totalFleetUnits} units in stock</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Completed Rentals */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed Rentals
              </span>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-emerald-500" />
                ) : (
                  analytics.completedRentals
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Truck className="size-3.5 text-blue-500" />
                <span className="text-foreground font-medium">{analytics.activeRentals} Active/In Transit</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Earnings */}
        <Card className="border border-border/80 shadow-xs hover:border-[#635BFF]/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Earnings
              </span>
              <div className="size-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <DollarSign className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-[#635BFF]" />
                ) : (
                  `$${analytics.totalEarnings.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Stripe Verified Escrow</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Monthly Earnings (Current Month) */}
        <Card className="border border-border/80 shadow-xs hover:border-blue-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Monthly Earnings
              </span>
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-blue-500" />
                ) : (
                  `$${analytics.currentMonthEarnings.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className="font-semibold text-foreground">
                  {analytics.currentMonthName} {analytics.currentYear}
                </span>
                {analytics.momGrowth !== null && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                      analytics.momGrowth >= 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {analytics.momGrowth >= 0 ? `+${analytics.momGrowth}%` : `${analytics.momGrowth}%`}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ANALYTICS CHARTS & REVENUE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Earnings (Past 6 Months Bar Chart) */}
        <Card className="lg:col-span-2 border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="size-5 text-amber-600" />
                  <span>Monthly Earnings Breakdown</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Rental revenue earned from customer bookings over the past 6 months.
                </CardDescription>
              </div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                This Month: ${analytics.currentMonthEarnings.toLocaleString()}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {isLoading ? (
              <div className="h-60 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-amber-600" />
              </div>
            ) : analytics.totalEarnings === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl border-border/70">
                <BarChart3 className="size-10 text-muted-foreground mb-2 opacity-40" />
                <h4 className="text-sm font-bold text-foreground">No Rental Revenue Recorded Yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Once customers book and pay for your equipment via Stripe, monthly earnings analytics will be generated automatically.
                </p>
                <Link href="/dashboard/owner/add-equipment" className="mt-3">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <PlusCircle className="size-3.5" />
                    <span>Add New Machinery</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* SVG / CSS Bar Chart */}
                <div className="h-48 w-full flex items-end justify-between gap-3 sm:gap-6 pt-6 px-3">
                  {analytics.monthlyStats.map((stat, idx) => {
                    const isCurrent =
                      stat.month === analytics.currentMonthName.substring(0, 3) &&
                      stat.year === analytics.currentYear
                    const heightPercent =
                      stat.earnings > 0
                        ? Math.max(14, Math.round((stat.earnings / analytics.maxMonthlyEarnings) * 100))
                        : 6

                    return (
                      <div key={`${stat.month}-${stat.year}`} className="flex-1 flex flex-col items-center h-full justify-end group">
                        {/* Hover Tooltip Amount */}
                        <div className="text-[11px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                          ${stat.earnings > 0 ? stat.earnings.toLocaleString() : 0}
                        </div>

                        {/* Bar Container */}
                        <div className="w-full max-w-[48px] bg-muted/40 rounded-t-lg overflow-hidden flex items-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className={`w-full rounded-t-lg transition-all ${
                              isCurrent
                                ? "bg-amber-600 group-hover:bg-amber-500 shadow-xs"
                                : stat.earnings > 0
                                ? "bg-amber-500/70 group-hover:bg-amber-500"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        </div>

                        {/* Month Label */}
                        <div className="mt-2 text-center">
                          <span
                            className={`text-xs block transition-colors ${
                              isCurrent
                                ? "font-bold text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground group-hover:text-foreground font-medium"
                            }`}
                          >
                            {stat.month}
                          </span>
                          <span className="text-[10px] text-muted-foreground block -mt-0.5">
                            {stat.count} {stat.count === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-amber-600" />
                      <span>Current Month</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-amber-500/70" />
                      <span>Past Months</span>
                    </span>
                  </div>
                  <span>Average Revenue per Rental: ${analytics.avgEarningsPerRental.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Fleet Utilization & Category Breakdown */}
        <Card className="border border-border/80 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="size-5 text-amber-600" />
              <span>Fleet Inventory Health</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Machinery availability, field utilization, and category distribution.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 space-y-5">
            {isLoading ? (
              <div className="h-56 flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-amber-600" />
              </div>
            ) : analytics.totalListedEquipment === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-xl border-border/70">
                <Boxes className="size-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm font-semibold text-foreground">No fleet equipment listed</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  List your industrial equipment to start tracking inventory health.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Fleet Utilization Progress */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Truck className="size-3.5 text-amber-600" />
                      <span>Fleet Deployment Rate</span>
                    </span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                      {analytics.utilizationRate}% Deployed
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics.utilizationRate}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-amber-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{analytics.currentlyDeployedUnits} units at customer sites</span>
                    <span>{analytics.totalFleetUnits} units in depot</span>
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                    Category Distribution
                  </span>
                  <div className="space-y-2">
                    {analytics.categoryList.slice(0, 4).map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-foreground truncate max-w-[170px]" title={cat.category}>
                            {cat.category}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {cat.count} listings ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT CUSTOMER RENTALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="size-5 text-amber-600" />
              <span>Recent Customer Rental Orders</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Latest bookings placed on your equipment fleet by verified customers.
            </p>
          </div>
          <Link href="/dashboard/owner/my-equipment-rental">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-amber-600 hover:text-amber-700">
              <span>View All Rental Orders</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center bg-card rounded-2xl border border-border/70">
            <Loader2 className="size-6 animate-spin text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading recent rental transactions...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="border border-dashed border-border/80 shadow-xs">
            <CardContent className="p-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Truck className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">No Customer Rentals Placed Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  When customers book and pay for your equipment, their orders and revenue will show up here.
                </p>
              </div>
              <Link href="/dashboard/owner/add-equipment">
                <Button size="sm" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white mt-2">
                  <PlusCircle className="size-4" />
                  <span>List New Equipment</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.slice(0, 3).map((b, idx) => {
              const isPaid = b.paymentStatus === "Paid" || b.status === "Confirmed"
              return (
                <Card
                  key={b._id || b.id || idx}
                  className="overflow-hidden border border-border/80 hover:border-amber-500/40 transition-all shadow-xs flex flex-col justify-between"
                >
                  <CardContent className="p-0">
                    <div className="relative h-36 w-full bg-muted">
                      {b.equipmentImage ? (
                        <Image
                          src={b.equipmentImage}
                          alt={b.equipmentName}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                          <Package className="size-6" />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                            <CheckCircle2 className="size-3" /> Paid via Stripe
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                            <Clock className="size-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {b.equipmentName}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>Client: <strong className="text-foreground">{b.userName || "Customer"}</strong></span>
                          <span className="font-extrabold text-foreground text-sm">
                            ${b.totalPrice?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{b.startDate} &rarr; {b.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title={b.deliveryAddress}>
                          <Package className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{b.quantity} unit(s) • {b.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-4 pt-0">
                    <Link href="/dashboard/owner/my-equipment-rental">
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                        <span>Manage Rental Order</span>
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* QUICK SERVICES & FLEET MANAGEMENT SHORTCUTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="size-5 text-amber-600" />
          <span>Fleet Management Shortcuts</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Add Equipment",
              href: "/dashboard/owner/add-equipment",
              description: "List a new excavator, bulldozer, or crane with daily/weekly rental rates.",
              icon: PlusCircle,
              color: "text-amber-600 bg-amber-500/10",
            },
            {
              title: "My Fleet Machinery",
              href: "/dashboard/owner/my-equipment",
              description: "Update rates, edit equipment specifications, and manage depot stock levels.",
              icon: Boxes,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              title: "Rental Orders",
              href: "/dashboard/owner/my-equipment-rental",
              description: "Track customer deliveries, update fulfillment status, and monitor returns.",
              icon: Truck,
              color: "text-emerald-500 bg-emerald-500/10",
            },
            {
              title: "Owner Business Profile",
              href: "/dashboard/owner/my-profile",
              description: "Manage your equipment business credentials, contact phone, and payout details.",
              icon: User,
              color: "text-purple-500 bg-purple-500/10",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-amber-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`size-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Access</span>
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
