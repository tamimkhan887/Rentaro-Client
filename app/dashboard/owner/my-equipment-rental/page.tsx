"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Eye,
  RefreshCw,
  Loader2,
  ExternalLink,
  ChevronRight,
  HardHat,
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  FileText,
  AlertTriangle,
} from "lucide-react"

import { Booking } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { getOwnerBookings, updateBookingStatus } from "@/lib/api/bookings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const STATUS_OPTIONS = [
  { value: "Confirmed", label: "Confirmed", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { value: "In Transit", label: "In Transit / Dispatched", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { value: "Completed", label: "Completed & Returned", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  { value: "Cancelled", label: "Cancelled", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
]

export default function OwnerMyEquipmentRentalPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const user = session?.user

  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Modal states
  const [viewBooking, setViewBooking] = React.useState<Booking | null>(null)
  const [statusBooking, setStatusBooking] = React.useState<Booking | null>(null)
  const [newStatus, setNewStatus] = React.useState<string>("Confirmed")
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<boolean>(false)

  // Fetch owner bookings
  const loadBookings = React.useCallback(async () => {
    const ownerEmail = user?.email
    if (!ownerEmail) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await getOwnerBookings(ownerEmail)
      setBookings(data || [])
    } catch (err) {
      console.error("Error loading owner bookings:", err)
      toast.add({
        title: "Failed to load rentals",
        description: "Could not fetch equipment bookings from the server.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  React.useEffect(() => {
    if (sessionLoading) return
    loadBookings()
  }, [sessionLoading, loadBookings])

  // Filtered bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase()
      const matchSearch =
        q === "" ||
        b.equipmentName?.toLowerCase().includes(q) ||
        b.userName?.toLowerCase().includes(q) ||
        b.userEmail?.toLowerCase().includes(q) ||
        b.deliveryAddress?.toLowerCase().includes(q) ||
        b.transactionId?.toLowerCase().includes(q) ||
        b.contactNumber?.toLowerCase().includes(q)

      const status = (b.status || "Pending").toLowerCase()
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && (status === "confirmed" || b.paymentStatus === "Paid")) ||
        (statusFilter === "in_transit" && (status === "in transit" || status === "in_transit" || status === "dispatched")) ||
        (statusFilter === "completed" && status === "completed") ||
        (statusFilter === "cancelled" && status === "cancelled")

      return matchSearch && matchStatus
    })
  }, [bookings, searchQuery, statusFilter])

  // Analytics stats
  const stats = React.useMemo(() => {
    const totalOrders = bookings.length
    const activeOrders = bookings.filter(
      (b) => b.status === "Confirmed" || b.status === "In Transit" || b.paymentStatus === "Paid"
    ).length
    const completedOrders = bookings.filter((b) => b.status === "Completed").length
    const totalRevenue = bookings.reduce((sum, b) => {
      if (b.paymentStatus === "Paid" || b.status === "Confirmed" || b.status === "Completed") {
        return sum + (Number(b.totalPrice) || 0)
      }
      return sum
    }, 0)

    return { totalOrders, activeOrders, completedOrders, totalRevenue }
  }, [bookings])

  // Handle status update
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!statusBooking) return

    const bookingId = statusBooking._id || statusBooking.id
    if (!bookingId) {
      toast.add({
        title: "Error",
        description: "Invalid booking ID.",
        type: "error",
      })
      return
    }

    setIsUpdatingStatus(true)
    try {
      const res = await updateBookingStatus(bookingId, newStatus)
      if (res.error) {
        toast.add({
          title: "Update Failed",
          description: res.error,
          type: "error",
        })
        return
      }

      toast.add({
        title: "Rental Status Updated!",
        description: `Order for ${statusBooking.equipmentName} updated to "${newStatus}".`,
        type: "success",
      })

      // Update state locally
      setBookings((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookingId ? { ...b, status: newStatus } : b
        )
      )

      setStatusBooking(null)
    } catch (err) {
      console.error("Status update error:", err)
      toast.add({
        title: "Error",
        description: "Failed to update booking status.",
        type: "error",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Get status badge UI
  const renderStatusBadge = (status?: string, paymentStatus?: string) => {
    const s = (status || "Pending").toLowerCase()

    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <CheckCircle2 className="size-3" />
          <span>Completed</span>
        </span>
      )
    }
    if (s === "in transit" || s === "in_transit" || s === "dispatched") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Truck className="size-3" />
          <span>In Transit</span>
        </span>
      )
    }
    if (s === "confirmed" || paymentStatus === "Paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          <span>Confirmed</span>
        </span>
      )
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <X className="size-3" />
          <span>Cancelled</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="size-3" />
        <span>Pending</span>
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/70 via-card to-orange-50/30 dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900/50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 mb-3">
              <HardHat className="size-3.5" />
              <span>Fleet Rental Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Equipment Rental Orders
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Monitor incoming customer rental bookings, verify Stripe payments, track dispatch status, and manage active machinery orders.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadBookings}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Link href="/dashboard/owner/my-equipment">
              <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs">
                <Package className="size-3.5" />
                <span>My Fleet</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Rental Orders
              </span>
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Package className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-primary" /> : stats.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bookings made by customers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active / In Transit
              </span>
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Truck className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-blue-500" /> : stats.activeOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently deployed on site
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed Returns
              </span>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-emerald-500" /> : stats.completedOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Returned to fleet depot
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rental Revenue
              </span>
              <div className="size-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                <CreditCard className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-[#635BFF]" /> : `$${stats.totalRevenue.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-3.5" />
                <span>Stripe Verified Escrow</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by equipment, customer, phone, or site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Orders" },
            { id: "confirmed", label: "Confirmed & Paid" },
            { id: "in_transit", label: "In Transit" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List / Table */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-amber-600" />
          <p className="text-sm text-muted-foreground">Loading equipment rental orders...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border/80 bg-card text-center space-y-4">
          <div className="size-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Truck className="size-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-lg text-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No matching rental orders found"
                : "No customer bookings yet"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "When customers book and pay for your equipment fleet, their orders will appear here with delivery details and payment records."}
            </p>
          </div>

          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/dashboard/owner/add-equipment">
              <Button size="sm" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                <Package className="size-4" />
                <span>List More Equipment</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Equipment</th>
                    <th scope="col" className="px-5 py-3.5">Customer</th>
                    <th scope="col" className="px-5 py-3.5">Rental Schedule</th>
                    <th scope="col" className="px-5 py-3.5">Qty / Rate</th>
                    <th scope="col" className="px-5 py-3.5">Total & Payment</th>
                    <th scope="col" className="px-5 py-3.5">Order Status</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBookings.map((b, idx) => {
                    const isPaid = b.paymentStatus === "Paid" || b.status === "Confirmed"
                    return (
                      <tr key={b._id || b.id || idx} className="hover:bg-muted/20 transition-colors">
                        {/* Equipment */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                              {b.equipmentImage ? (
                                <Image
                                  src={b.equipmentImage}
                                  alt={b.equipmentName}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                                  <Package className="size-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-[200px]">
                              <span className="font-semibold text-foreground truncate block text-sm" title={b.equipmentName}>
                                {b.equipmentName}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <span className="font-mono">{b.rentalType}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5 text-xs">
                            <p className="font-semibold text-foreground flex items-center gap-1">
                              <User className="size-3 text-muted-foreground" />
                              <span>{b.userName || "Customer"}</span>
                            </p>
                            <a
                              href={`mailto:${b.userEmail}`}
                              className="text-muted-foreground hover:text-primary flex items-center gap-1 truncate max-w-[160px]"
                              title={b.userEmail}
                            >
                              <Mail className="size-3" />
                              <span className="truncate">{b.userEmail}</span>
                            </a>
                            <a
                              href={`tel:${b.contactNumber}`}
                              className="text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                              <Phone className="size-3" />
                              <span>{b.contactNumber}</span>
                            </a>
                          </div>
                        </td>

                        {/* Rental Schedule */}
                        <td className="px-5 py-4">
                          <div className="space-y-1 text-xs">
                            <span className="font-medium text-foreground flex items-center gap-1">
                              <Calendar className="size-3.5 text-primary" />
                              <span>{b.startDate} &rarr; {b.endDate}</span>
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate max-w-[170px]" title={b.deliveryAddress}>
                              <MapPin className="size-3" />
                              <span className="truncate">{b.deliveryAddress}</span>
                            </span>
                          </div>
                        </td>

                        {/* Qty & Rate */}
                        <td className="px-5 py-4">
                          <div className="text-xs">
                            <span className="font-bold text-foreground">
                              {b.quantity} unit(s)
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              ${b.rentalPrice} / {b.rentalType}
                            </p>
                          </div>
                        </td>

                        {/* Total & Payment */}
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-extrabold text-foreground text-sm">
                              ${b.totalPrice?.toLocaleString() || 0}
                            </span>
                            <div className="mt-1">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <Check className="size-3" /> Paid via Stripe
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  <Clock className="size-3" /> Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="px-5 py-4">
                          {renderStatusBadge(b.status, b.paymentStatus)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewBooking(b)}
                              className="h-8 text-xs gap-1"
                            >
                              <Eye className="size-3.5" />
                              <span>Details</span>
                            </Button>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setStatusBooking(b)
                                setNewStatus(b.status || "Confirmed")
                              }}
                              className="h-8 text-xs gap-1"
                            >
                              <Truck className="size-3.5" />
                              <span>Status</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredBookings.map((b, idx) => {
              const isPaid = b.paymentStatus === "Paid" || b.status === "Confirmed"
              return (
                <Card key={b._id || b.id || idx} className="overflow-hidden border border-border/80 shadow-xs">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                        {b.equipmentImage ? (
                          <Image
                            src={b.equipmentImage}
                            alt={b.equipmentName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                            <Package className="size-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-foreground truncate">
                          {b.equipmentName}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{b.quantity} unit(s) • {b.rentalType}</span>
                          <span className="font-extrabold text-foreground text-sm">
                            ${b.totalPrice?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          {renderStatusBadge(b.status, b.paymentStatus)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/60 pt-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          <span>{b.userName || "Customer"}</span>
                        </span>
                        <a href={`tel:${b.contactNumber}`} className="text-primary font-medium hover:underline">
                          {b.contactNumber}
                        </a>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 text-primary shrink-0" />
                        <span>{b.startDate} &rarr; {b.endDate}</span>
                      </div>

                      <div className="flex items-center gap-1 truncate" title={b.deliveryAddress}>
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span className="truncate">{b.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewBooking(b)}
                        className="flex-1 text-xs gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span>View Details</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setStatusBooking(b)
                          setNewStatus(b.status || "Confirmed")
                        }}
                        className="flex-1 text-xs gap-1"
                      >
                        <Truck className="size-3.5" />
                        <span>Update Status</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={!!viewBooking} onOpenChange={(open) => !open && setViewBooking(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span>Rental Order Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete customer booking information and delivery instructions.
            </DialogDescription>
          </DialogHeader>

          {viewBooking && (
            <div className="space-y-5 pt-2">
              {/* Equipment Snapshot */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-muted/30 border border-border/70">
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {viewBooking.equipmentImage ? (
                    <Image
                      src={viewBooking.equipmentImage}
                      alt={viewBooking.equipmentName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                      <Package className="size-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-foreground truncate">
                    {viewBooking.equipmentName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rental Rate: ${viewBooking.rentalPrice} / {viewBooking.rentalType}
                  </p>
                  <p className="text-xs font-semibold text-primary mt-1">
                    Booked Quantity: {viewBooking.quantity} unit(s)
                  </p>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="space-y-2 p-3.5 rounded-xl border border-border/70 bg-card">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Customer Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Customer Name</span>
                    <span className="font-semibold text-foreground">{viewBooking.userName || "Customer"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Contact Phone</span>
                    <a href={`tel:${viewBooking.contactNumber}`} className="font-semibold text-primary hover:underline">
                      {viewBooking.contactNumber}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block">Email Address</span>
                    <a href={`mailto:${viewBooking.userEmail}`} className="font-semibold text-primary hover:underline">
                      {viewBooking.userEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Site / Delivery Address */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-border/70 bg-card">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Delivery / Jobsite Location
                </span>
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{viewBooking.deliveryAddress}</span>
                </div>
              </div>

              {/* Dates & Billing */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground block">Rental Schedule</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {viewBooking.startDate} &rarr; {viewBooking.endDate}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground block">Total Revenue</span>
                  <span className="font-bold text-foreground mt-0.5 block text-base text-primary">
                    ${viewBooking.totalPrice?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4" />
                    <span>Payment Status: Paid via Stripe</span>
                  </span>
                  <span>{viewBooking.paymentStatus || "Paid"}</span>
                </div>
                {viewBooking.transactionId && (
                  <p className="text-[11px] text-muted-foreground font-mono select-all truncate">
                    Txn ID: {viewBooking.transactionId}
                  </p>
                )}
              </div>

              {/* Additional Customer Notes */}
              {viewBooking.additionalNotes && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-xs">
                  <span className="font-semibold text-foreground block mb-0.5">Special Customer Instructions:</span>
                  <p className="text-muted-foreground italic">&ldquo;{viewBooking.additionalNotes}&rdquo;</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setViewBooking(null)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPDATE STATUS DIALOG */}
      <Dialog open={!!statusBooking} onOpenChange={(open) => !open && setStatusBooking(null)}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Truck className="size-5 text-amber-600" />
              <span>Update Rental Status</span>
            </DialogTitle>
            <DialogDescription>
              Change order fulfillment status for <span className="font-semibold text-foreground">{statusBooking?.equipmentName}</span>.
            </DialogDescription>
          </DialogHeader>

          {statusBooking && (
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="statusSelect" className="text-xs font-semibold">
                  Select New Order Status
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        newStatus === opt.value
                          ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs"
                          : "border-border/70 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="statusRadio"
                          value={opt.value}
                          checked={newStatus === opt.value}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="size-4 text-amber-600 accent-amber-600"
                        />
                        <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${opt.color}`}>
                        {opt.value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {newStatus === "Cancelled" && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    Cancelling this rental order will automatically restore the {statusBooking.quantity} unit(s) back to your fleet stock.
                  </span>
                </div>
              )}

              <DialogFooter className="pt-2 gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusBooking(null)}
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2 font-semibold"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Confirm Status Update</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
