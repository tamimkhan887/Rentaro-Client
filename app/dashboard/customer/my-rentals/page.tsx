"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  MapPin,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CreditCard,
  RotateCcw,
  AlertCircle,
  Loader2,
  ArrowRight,
  Phone,
  User,
  Check,
  Printer,
} from "lucide-react"

import { Booking } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { getUserBookings } from "@/lib/api/bookings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function CustomerMyRentalsPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  React.useEffect(() => {
    if (sessionLoading) return

    const userEmail = session?.user?.email
    if (!userEmail) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadBookings() {
      try {
        setIsLoading(true)
        const data = await getUserBookings(userEmail as string)
        if (isMounted) {
          setBookings(data || [])
        }
      } catch (err) {
        console.error("Error loading user bookings:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      isMounted = false
    }
  }, [session?.user?.email, sessionLoading])

  // Filter bookings based on search & status filter
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        searchQuery === "" ||
        b.equipmentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && (b.status === "Confirmed" || b.paymentStatus === "Paid")) ||
        (statusFilter === "pending" && b.status === "Pending" && b.paymentStatus !== "Paid") ||
        (statusFilter === "completed" && b.status === "Completed")

      return matchSearch && matchStatus
    })
  }, [bookings, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Equipment Rentals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your active bookings, rental durations, site locations, and verified Stripe payments.
          </p>
        </div>
        <Link href="/equipment">
          <Button className="gap-2 shrink-0">
            <Package className="h-4 w-4" />
            <span>Browse More Equipment</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by equipment, site address, or txn ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Rentals" },
            { id: "confirmed", label: "Confirmed & Paid" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your rental reservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border/80 bg-card text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Package className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-lg text-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No matching rentals found"
                : "No rental reservations yet"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search criteria or filter to see more rentals."
                : "When you book industrial machinery and complete payment, your reservations will appear here."}
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
            <Link href="/equipment">
              <Button size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                <span>Explore Available Equipment</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((b, idx) => {
              const isPaid = b.paymentStatus === "Paid" || b.status === "Confirmed"
              const bookingId = b._id || b.id || `booking-${idx}`

              return (
                <motion.div
                  key={bookingId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                >
                  <Card className="overflow-hidden border border-border/80 hover:border-primary/40 transition-all shadow-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-stretch">
                        {/* Equipment Photo */}
                        <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-muted">
                          {b.equipmentImage ? (
                            <Image
                              src={b.equipmentImage}
                              alt={b.equipmentName}
                              fill
                              sizes="(max-width: 768px) 100vw, 224px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}

                          {/* Paid Badge Overlay */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                                <CheckCircle2 className="h-3 w-3" /> Paid & Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                                <Clock className="h-3 w-3" /> Payment Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rental Details */}
                        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-lg text-foreground">
                                  {b.equipmentName}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Rental Type: <span className="font-medium text-foreground">{b.rentalType}</span> • Reserved Quantity: <span className="font-semibold text-foreground">{b.quantity} unit(s)</span>
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-xs text-muted-foreground">Total Paid</span>
                                <div className="text-lg font-extrabold text-primary">
                                  ${b.totalPrice?.toLocaleString() || "0"}
                                </div>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 text-xs">
                              <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/40">
                                <Calendar className="h-4 w-4 text-primary shrink-0" />
                                <span className="truncate">
                                  {b.startDate} &rarr; {b.endDate}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/40" title={b.deliveryAddress}>
                                <MapPin className="h-4 w-4 text-primary shrink-0" />
                                <span className="truncate">{b.deliveryAddress}</span>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/40">
                                <CreditCard className="h-4 w-4 text-primary shrink-0" />
                                <span className="truncate font-mono text-[11px]">
                                  {b.transactionId ? `${b.transactionId.substring(0, 14)}...` : "Stripe Verified"}
                                </span>
                              </div>
                            </div>

                            {b.additionalNotes && (
                              <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40 italic">
                                &ldquo;{b.additionalNotes}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Escrow protected by Rentora</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {b.equipmentId && (
                                <Link href={`/equipment/${b.equipmentId}`}>
                                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>View Equipment</span>
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
