"use client"

import * as React from "react"
import Image from "next/image"
import {
  ClipboardList,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  DollarSign,
  User,
  HardHat,
  Package,
  Calendar,
  CreditCard,
  Eye,
  AlertTriangle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Filter,
  ShieldCheck,
} from "lucide-react"

import { Booking } from "@/types/equipment"
import { getAllBookingsWithError, updateBookingStatus } from "@/lib/api/bookings"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const BOOKING_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "In Transit",
  "Completed",
  "Cancelled",
] as const

function getDurationDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  const diffMs = end.getTime() - start.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, days)
}

function getBookingStatusBadge(status?: string) {
  const normalized = (status || "Pending").toLowerCase()
  switch (normalized) {
    case "confirmed":
      return {
        label: "Confirmed",
        classes: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: CheckCircle2,
      }
    case "in transit":
      return {
        label: "In Transit",
        classes: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        icon: Truck,
      }
    case "completed":
      return {
        label: "Completed",
        classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
      }
    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: XCircle,
      }
    default:
      return {
        label: status || "Pending",
        classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: Clock,
      }
  }
}

function getPaymentStatusBadge(paymentStatus?: string) {
  const normalized = (paymentStatus || "Pending").toLowerCase()
  if (normalized === "paid") {
    return {
      label: "Paid",
      classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    }
  }
  if (normalized === "unpaid" || normalized === "failed") {
    return {
      label: paymentStatus || "Unpaid",
      classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    }
  }
  return {
    label: paymentStatus || "Pending",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  }
}

export default function AdminAllRentalsPage() {
  const { isPending: sessionLoading } = useSession()

  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [paymentFilter, setPaymentFilter] = React.useState<string>("All")

  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)

  const fetchBookings = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getAllBookingsWithError()
      setBookings(data)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load platform rental bookings."
      setErrorMessage(msg)
      toast.add({
        title: "Error Loading Rentals",
        description: msg,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (sessionLoading) return
    fetchBookings()
  }, [sessionLoading, fetchBookings])

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!bookingId) return
    try {
      setUpdatingId(bookingId)
      const result = await updateBookingStatus(bookingId, newStatus)
      if (result.error) {
        toast.add({
          title: "Status Update Failed",
          description: result.error,
          type: "error",
        })
        return
      }

      setBookings((prev) =>
        prev.map((b) =>
          (b._id || b.id) === bookingId ? { ...b, status: newStatus } : b
        )
      )

      setSelectedBooking((prev) =>
        prev && (prev._id || prev.id) === bookingId
          ? { ...prev, status: newStatus }
          : prev
      )

      toast.add({
        title: "Booking Status Updated",
        description: `Rental status changed to ${newStatus}.`,
        type: "success",
      })
    } catch (err) {
      toast.add({
        title: "Update Error",
        description: err instanceof Error ? err.message : "Could not update status.",
        type: "error",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  // Filtered bookings
  const filteredBookings = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === "All" ||
        (b.status || "Pending").toLowerCase() === statusFilter.toLowerCase()

      const matchesPayment =
        paymentFilter === "All" ||
        (b.paymentStatus || "Pending").toLowerCase() === paymentFilter.toLowerCase()

      if (!matchesStatus || !matchesPayment) return false
      if (!q) return true

      return (
        (b.userName || "").toLowerCase().includes(q) ||
        (b.userEmail || "").toLowerCase().includes(q) ||
        (b.ownerName || "").toLowerCase().includes(q) ||
        (b.ownerEmail || "").toLowerCase().includes(q) ||
        (b.equipmentName || "").toLowerCase().includes(q) ||
        (b.transactionId || "").toLowerCase().includes(q) ||
        (b._id || b.id || "").toLowerCase().includes(q)
      )
    })
  }, [bookings, searchQuery, statusFilter, paymentFilter])

  // Summary metrics
  const metrics = React.useMemo(() => {
    const total = bookings.length
    const paidBookings = bookings.filter(
      (b) => (b.paymentStatus || "").toLowerCase() === "paid"
    )
    const totalRevenue = paidBookings.reduce(
      (sum, b) => sum + (Number(b.totalPrice) || 0),
      0
    )
    const activeCount = bookings.filter((b) => {
      const s = (b.status || "").toLowerCase()
      return s === "confirmed" || s === "in transit"
    }).length
    const completedCount = bookings.filter(
      (b) => (b.status || "").toLowerCase() === "completed"
    ).length
    const pendingCount = bookings.filter(
      (b) => (b.status || "pending").toLowerCase() === "pending"
    ).length

    return {
      total,
      paidCount: paidBookings.length,
      totalRevenue,
      activeCount,
      completedCount,
      pendingCount,
    }
  }, [bookings])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-300/60 dark:border-rose-900/40 bg-gradient-to-br from-rose-500/10 via-card to-amber-500/5 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              <ShieldCheck className="size-3.5" />
              <span>Admin Rental Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              All Platform Rental Bookings
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Monitor customer and owner rental transactions, inspect payment statuses, and manage booking lifecycle across the entire Rentora marketplace.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={isLoading}
            className="gap-2 self-start md:self-auto"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Rentals
              </span>
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ClipboardList className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-rose-600" /> : metrics.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.pendingCount} pending review
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Paid Volume
              </span>
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-emerald-600" />
                ) : (
                  `$${metrics.totalRevenue.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.paidCount} verified Stripe payments
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
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Truck className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-blue-600" /> : metrics.activeCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Confirmed or currently deployed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed Rentals
              </span>
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isLoading ? <Loader2 className="size-6 animate-spin text-amber-600" /> : metrics.completedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully fulfilled orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, owner, equipment name, or transaction ID..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="size-3.5" />
              <span>Booking:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by booking status"
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Statuses</option>
              {BOOKING_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-1">
              <CreditCard className="size-3.5" />
              <span>Payment:</span>
            </div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              aria-label="Filter by payment status"
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content: Loading / Error / Empty / Table */}
      {isLoading ? (
        <Card className="border border-border/80 shadow-xs">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="size-8 animate-spin text-rose-600" />
            <p className="text-sm font-semibold text-foreground">
              Loading rental booking records...
            </p>
            <p className="text-xs text-muted-foreground">
              Fetching customer, owner, and payment data from the server.
            </p>
          </CardContent>
        </Card>
      ) : errorMessage ? (
        <Card className="border border-rose-500/40 shadow-xs">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Unable to Load Rental Records
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                {errorMessage}
              </p>
            </div>
            <Button onClick={fetchBookings} size="sm" className="gap-2 bg-rose-600 hover:bg-rose-700 text-white">
              <RefreshCw className="size-4" />
              <span>Retry</span>
            </Button>
          </CardContent>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card className="border border-dashed border-border/80 shadow-xs">
          <CardContent className="p-12 text-center space-y-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <ClipboardList className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No Rental Bookings Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {bookings.length === 0
                ? "There are no rental bookings recorded on the platform yet."
                : "No rental records match your current search or filter criteria."}
            </p>
            {(searchQuery || statusFilter !== "All" || paymentFilter !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("All")
                  setPaymentFilter("All")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                Rental Booking Ledger
              </CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredBookings.length} of {bookings.length} total rental records
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-4">Equipment</th>
                  <th className="py-3.5 px-4">Customer Information</th>
                  <th className="py-3.5 px-4">Owner Information</th>
                  <th className="py-3.5 px-4">Rental Duration</th>
                  <th className="py-3.5 px-4">Booking Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Booking Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredBookings.map((booking, idx) => {
                  const bookingId = booking._id || booking.id || String(idx)
                  const durationDays = getDurationDays(booking.startDate, booking.endDate)
                  const statusBadge = getBookingStatusBadge(booking.status)
                  const paymentBadge = getPaymentStatusBadge(booking.paymentStatus)
                  const StatusIcon = statusBadge.icon
                  const isUpdating = updatingId === bookingId

                  return (
                    <tr
                      key={bookingId}
                      className="hover:bg-muted/30 transition-colors align-middle"
                    >
                      {/* Equipment Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="relative size-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/60">
                            {booking.equipmentImage ? (
                              <Image
                                src={booking.equipmentImage}
                                alt={booking.equipmentName || "Equipment"}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-muted-foreground">
                                <Package className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[180px]" title={booking.equipmentName}>
                              {booking.equipmentName || "Unnamed Equipment"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.quantity || 1} unit(s) • {booking.rentalType || "Daily"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer Information */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[175px] space-y-0.5">
                          <p className="font-medium text-foreground flex items-center gap-1.5 text-xs">
                            <User className="size-3.5 text-blue-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{booking.userName || "Customer"}</span>
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[175px]" title={booking.userEmail}>
                            {booking.userEmail}
                          </p>
                          {booking.contactNumber && (
                            <p className="text-[11px] text-muted-foreground">
                              {booking.contactNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Owner Information */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[170px] space-y-0.5">
                          <p className="font-medium text-foreground flex items-center gap-1.5 text-xs">
                            <HardHat className="size-3.5 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[145px]">{booking.ownerName || "Equipment Owner"}</span>
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[170px]" title={booking.ownerEmail}>
                            {booking.ownerEmail || "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* Rental Duration */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[155px] space-y-0.5">
                          <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-primary shrink-0" />
                            <span>
                              {booking.startDate} &rarr; {booking.endDate}
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground pl-5">
                            {durationDays > 0 ? `${durationDays} day(s)` : "Custom period"}
                          </p>
                        </div>
                      </td>

                      {/* Booking Amount */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[100px]">
                          <p className="font-extrabold text-foreground">
                            ${(Number(booking.totalPrice) || 0).toLocaleString()}
                          </p>
                          {booking.rentalPrice ? (
                            <p className="text-[11px] text-muted-foreground">
                              ${booking.rentalPrice}/{booking.rentalType || "day"}
                            </p>
                          ) : null}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[110px] space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${paymentBadge.classes}`}
                          >
                            <CreditCard className="size-3" />
                            {paymentBadge.label}
                          </span>
                          {booking.transactionId && (
                            <p
                              className="text-[10px] font-mono text-muted-foreground truncate max-w-[110px]"
                              title={booking.transactionId}
                            >
                              {booking.transactionId}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Booking Status */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-[130px]">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.classes}`}
                          >
                            <StatusIcon className="size-3" />
                            {statusBadge.label}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 min-w-[185px]">
                          <select
                            value={booking.status || "Pending"}
                            disabled={isUpdating || !(booking._id || booking.id)}
                            onChange={(e) => handleStatusChange(bookingId, e.target.value)}
                            aria-label={`Change booking status for ${booking.equipmentName}`}
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          >
                            {BOOKING_STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="h-8 px-2.5 gap-1 text-xs"
                          >
                            {isUpdating ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Eye className="size-3.5" />
                            )}
                            <span>Details</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Rental Detail Inspection Modal */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardList className="size-5 text-rose-600" />
                  <span>Rental Booking Details</span>
                </DialogTitle>
                <DialogDescription>
                  Complete transaction, customer, owner, and fulfillment details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-sm">
                {/* Equipment Summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="relative size-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {selectedBooking.equipmentImage ? (
                      <Image
                        src={selectedBooking.equipmentImage}
                        alt={selectedBooking.equipmentName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">
                      {selectedBooking.equipmentName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedBooking.quantity} unit(s) • ${selectedBooking.rentalPrice}/{selectedBooking.rentalType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-foreground">
                      ${(Number(selectedBooking.totalPrice) || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedBooking.paymentStatus || "Pending"}
                    </p>
                  </div>
                </div>

                {/* Customer & Owner Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-border/70 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <User className="size-3.5" /> Customer Info
                    </p>
                    <p className="font-semibold text-foreground">{selectedBooking.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 break-all">
                      <Mail className="size-3 shrink-0" /> {selectedBooking.userEmail}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3 shrink-0" /> {selectedBooking.contactNumber || "N/A"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-border/70 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <HardHat className="size-3.5" /> Owner Info
                    </p>
                    <p className="font-semibold text-foreground">
                      {selectedBooking.ownerName || "Equipment Partner"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 break-all">
                      <Mail className="size-3 shrink-0" /> {selectedBooking.ownerEmail || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Schedule & Delivery */}
                <div className="p-3 rounded-xl border border-border/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5" /> Rental Duration:
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedBooking.startDate} &rarr; {selectedBooking.endDate} (
                      {getDurationDays(selectedBooking.startDate, selectedBooking.endDate)} days)
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                      <MapPin className="size-3.5" /> Delivery Address:
                    </span>
                    <span className="font-medium text-foreground text-right">
                      {selectedBooking.deliveryAddress || "N/A"}
                    </span>
                  </div>
                  {selectedBooking.transactionId && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="size-3.5" /> Transaction ID:
                      </span>
                      <span className="font-mono text-[11px] text-foreground break-all">
                        {selectedBooking.transactionId}
                      </span>
                    </div>
                  )}
                  {selectedBooking.additionalNotes && (
                    <div className="pt-1 border-t border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1.5 mb-1">
                        <FileText className="size-3.5" /> Customer Notes:
                      </span>
                      <p className="text-foreground bg-muted/30 p-2 rounded-lg">
                        {selectedBooking.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Admin Status Management */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/70">
                  <span className="text-xs font-semibold text-foreground">
                    Update Booking Status:
                  </span>
                  <select
                    value={selectedBooking.status || "Pending"}
                    disabled={updatingId === (selectedBooking._id || selectedBooking.id)}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedBooking._id || selectedBooking.id || "",
                        e.target.value
                      )
                    }
                    className="h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {BOOKING_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
