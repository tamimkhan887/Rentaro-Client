"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Calendar,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Loader2,
  BarChart3,
  PieChart,
  DollarSign,
  AlertCircle,
  HardHat,
  ChevronRight,
  Receipt,
  Layers,
} from "lucide-react"

import { Booking, FavoriteItem } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { getUserBookings } from "@/lib/api/bookings"
import { getUserFavorites } from "@/lib/api/favorites"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function CustomerDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const user = session?.user

  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Fetch bookings and favorites for the current user
  React.useEffect(() => {
    if (sessionLoading) return

    const userEmail = session?.user?.email
    if (!userEmail) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadData() {
      try {
        setIsLoading(true)
        const [bookingsData, favoritesData] = await Promise.all([
          getUserBookings(userEmail as string),
          getUserFavorites(userEmail as string),
        ])

        if (isMounted) {
          setBookings(bookingsData || [])
          setFavorites(favoritesData || [])
        }
      } catch (err) {
        console.error("Error loading customer overview data:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [session?.user?.email, sessionLoading])

  // Analytics Calculations
  const analytics = React.useMemo(() => {
    const totalRentals = bookings.length
    const confirmedRentals = bookings.filter(
      (b) => b.status === "Confirmed" || b.paymentStatus === "Paid"
    )
    const pendingRentals = bookings.filter(
      (b) => b.status === "Pending" && b.paymentStatus !== "Paid"
    )
    const completedRentals = bookings.filter((b) => b.status === "Completed")

    // Total spent across paid rentals
    const totalSpent = bookings.reduce((sum, b) => {
      if (b.paymentStatus === "Paid" || b.status === "Confirmed" || b.status === "Completed") {
        return sum + (Number(b.totalPrice) || 0)
      }
      return sum
    }, 0)

    // Rental type breakdown
    const typeCounts: Record<string, number> = { Daily: 0, Weekly: 0, Monthly: 0 }
    bookings.forEach((b) => {
      const type = (b.rentalType || "Daily").toLowerCase()
      if (type.includes("week")) typeCounts.Weekly++
      else if (type.includes("month")) typeCounts.Monthly++
      else typeCounts.Daily++
    })

    const typeTotal = totalRentals || 1
    const typeDistribution = [
      { name: "Daily", count: typeCounts.Daily, pct: Math.round((typeCounts.Daily / typeTotal) * 100), color: "bg-[#e77952]" },
      { name: "Weekly", count: typeCounts.Weekly, pct: Math.round((typeCounts.Weekly / typeTotal) * 100), color: "bg-blue-500" },
      { name: "Monthly", count: typeCounts.Monthly, pct: Math.round((typeCounts.Monthly / typeTotal) * 100), color: "bg-emerald-500" },
    ]

    // Monthly spending breakdown for visual chart (last 6 months)
    const now = new Date()
    const monthsMap: Record<string, number> = {}
    const monthsList: string[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString("en-US", { month: "short" })
      monthsMap[key] = 0
      monthsList.push(key)
    }

    bookings.forEach((b) => {
      if (b.createdAt) {
        const d = new Date(b.createdAt)
        const key = d.toLocaleString("en-US", { month: "short" })
        if (monthsMap[key] !== undefined) {
          monthsMap[key] += Number(b.totalPrice) || 0
        }
      } else {
        // Fallback to current month if createdAt is missing
        const currentMonth = now.toLocaleString("en-US", { month: "short" })
        monthsMap[currentMonth] = (monthsMap[currentMonth] || 0) + (Number(b.totalPrice) || 0)
      }
    })

    const monthlyChartData = monthsList.map((m) => ({
      month: m,
      amount: monthsMap[m] || 0,
    }))

    const maxMonthlySpend = Math.max(...monthlyChartData.map((d) => d.amount), 1)

    // Average spend per rental
    const avgSpend = totalRentals > 0 ? Math.round(totalSpent / totalRentals) : 0

    return {
      totalRentals,
      confirmedCount: confirmedRentals.length,
      pendingCount: pendingRentals.length,
      completedCount: completedRentals.length,
      totalSpent,
      avgSpend,
      typeDistribution,
      monthlyChartData,
      maxMonthlySpend,
      favoriteCount: favorites.length,
    }
  }, [bookings, favorites])

  // Dynamic greeting
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <div className="space-y-8">
      {/* Customer Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3.5" />
              <span>Customer Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {greeting}, {user?.name || "Customer"}! 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Welcome to your equipment management overview. Review your active rentals, explore machinery analytics, and track your reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/equipment">
              <Button className="gap-2 shadow-sm font-medium">
                <Search className="size-4" />
                <span>Browse Machinery</span>
              </Button>
            </Link>
            <Link href="/dashboard/customer/my-rentals">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="size-4" />
                <span>My Rentals</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Rentals */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Package className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-primary" /> : analytics.totalRentals}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {analytics.confirmedCount} Confirmed
                </span>
                <span>• {analytics.pendingCount} Pending</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Active & Confirmed */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Rentals
              </span>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-emerald-500" /> : analytics.confirmedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>100% Escrow Protected</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Spent */}
        <Card className="border border-border/80 shadow-xs hover:border-[#635BFF]/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Invested
              </span>
              <div className="size-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <CreditCard className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-[#635BFF]" />
                ) : (
                  `$${analytics.totalSpent.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-primary font-medium">
                  ~${analytics.avgSpend.toLocaleString()}
                </span>
                <span>avg / equipment rental</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Saved Favorites */}
        <Card className="border border-border/80 shadow-xs hover:border-rose-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Saved Wishlist
              </span>
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Heart className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-rose-500" /> : analytics.favoriteCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/dashboard/customer/favorites" className="hover:text-foreground underline">
                  View saved machinery &rarr;
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section: Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Rental Spending Trend (2 cols) */}
        <Card className="lg:col-span-2 border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  <span>Rental Activity & Spend Trend</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly expenditure on heavy equipment rentals across the past 6 months.
                </CardDescription>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                Total: ${analytics.totalSpent.toLocaleString()}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            {isLoading ? (
              <div className="h-56 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : analytics.totalRentals === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-xl border-border/60">
                <BarChart3 className="size-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm font-semibold text-foreground">No rental spending history yet</p>
                <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
                  Once you book equipment, monthly spending trends and volume will appear here.
                </p>
                <Link href="/equipment" className="mt-3">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Search className="size-3.5" />
                    <span>Find Equipment</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* SVG / CSS Bar Chart */}
                <div className="h-44 w-full flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
                  {analytics.monthlyChartData.map((d, index) => {
                    const heightPercent =
                      d.amount > 0 ? Math.max(12, Math.round((d.amount / analytics.maxMonthlySpend) * 100)) : 6

                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                        {/* Tooltip / Value on top */}
                        <div className="text-[11px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-semibold">
                          ${d.amount > 0 ? d.amount.toLocaleString() : 0}
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[42px] bg-muted/40 rounded-t-lg overflow-hidden flex items-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className={`w-full rounded-t-lg transition-all ${
                              d.amount > 0
                                ? "bg-primary group-hover:bg-primary/90"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        </div>

                        {/* Month Label */}
                        <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {d.month}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>Active Spend</span>
                  </div>
                  <span>Average per booking: ${analytics.avgSpend.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Rental Duration & Fleet Distribution (1 col) */}
        <Card className="border border-border/80 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <span>Rental Types</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Preference by Daily, Weekly, or Monthly rental contracts.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 space-y-5">
            {isLoading ? (
              <div className="h-44 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : analytics.totalRentals === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-xl border-border/60">
                <PieChart className="size-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm font-semibold text-foreground">No distribution data</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rental terms will be visualized here once you book equipment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Horizontal distribution bars */}
                <div className="space-y-3">
                  {analytics.typeDistribution.map((item) => (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-foreground flex items-center gap-1.5">
                          <span className={`size-2.5 rounded-full ${item.color}`} />
                          {item.name} Rentals
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} order{item.count !== 1 ? "s" : ""} ({item.pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Health & Fulfillment Indicator */}
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Payment Health</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {analytics.totalRentals > 0
                        ? `${Math.round((analytics.confirmedCount / analytics.totalRentals) * 100)}%`
                        : "100%"} Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    All completed bookings are backed by Stripe Payment Gateway with digital escrow.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Rentals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              <span>Recent Equipment Rentals</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Your most recent reservations, scheduled delivery dates, and payment receipts.
            </p>
          </div>
          <Link href="/dashboard/customer/my-rentals">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
              <span>View All Rentals</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center bg-card rounded-2xl border border-border/70">
            <Loader2 className="size-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading recent bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="border border-dashed border-border/80 shadow-xs">
            <CardContent className="p-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Package className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">No Bookings Placed Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Browse our certified fleet of excavators, cranes, compaction units, and power generators.
                </p>
              </div>
              <Link href="/equipment">
                <Button size="sm" className="gap-2 mt-2">
                  <Search className="size-4" />
                  <span>Explore Equipment Fleet</span>
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
                  className="overflow-hidden border border-border/80 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between"
                >
                  <CardContent className="p-0">
                    {/* Thumbnail & Badges */}
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
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                          <Package className="size-6" />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                            <CheckCircle2 className="size-3" /> Paid & Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                            <Clock className="size-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {b.equipmentName}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{b.rentalType} Rental • {b.quantity} unit</span>
                          <span className="font-extrabold text-foreground text-sm">
                            ${b.totalPrice?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">
                            {b.startDate} &rarr; {b.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5" title={b.deliveryAddress}>
                          <Package className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{b.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-4 pt-0">
                    <Link href={`/equipment/${b.equipmentId}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                        <span>View Details</span>
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

      {/* Quick Navigation / Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <span>Quick Access Services</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "My Rentals",
              href: "/dashboard/customer/my-rentals",
              description: "Track equipment delivery, rental schedules, and review receipts.",
              icon: ShoppingBag,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              title: "Saved Favorites",
              href: "/dashboard/customer/favorites",
              description: "Review bookmarked industrial machinery and initiate bookings.",
              icon: Heart,
              color: "text-rose-500 bg-rose-500/10",
            },
            {
              title: "Profile & Site Settings",
              href: "/dashboard/customer/profile",
              description: "Update your contact phone, delivery site details, and account info.",
              icon: User,
              color: "text-[#e77952] bg-[#e77952]/10",
            },
            {
              title: "Fleet Catalog",
              href: "/equipment",
              description: "Search all available excavators, cranes, dozers, and earthmovers.",
              icon: Search,
              color: "text-emerald-500 bg-emerald-500/10",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`size-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Customer Trust & Escrow Guarantee */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Rentora Escrow & Buyer Protection</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every equipment rental is safeguarded by Rentora Escrow. Funds are released only after on-site equipment arrival and inspection.
            </p>
          </div>
        </div>

        <Link href="/about" className="shrink-0">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <span>Learn How It Works</span>
            <ExternalLink className="size-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
