import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Package,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  FileCheck2,
  ArrowRight,
  AlertTriangle,
  Receipt,
} from "lucide-react"

import { stripe } from "@/lib/stripe"
import { createBooking } from "@/lib/api/bookings"
import { CheckoutReceiptActions } from "@/components/checkout-receipt-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Payment Successful | Rentora",
  description: "Your equipment booking payment has been confirmed.",
}

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const resolvedParams = await searchParams
  const sessionId =
    typeof resolvedParams.session_id === "string" ? resolvedParams.session_id : null

  if (!sessionId) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground">No Checkout Session</h1>
          <p className="text-sm text-muted-foreground">
            We could not locate a valid Stripe checkout session ID. If you completed a payment, please check your rentals dashboard.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/customer/my-rentals">
              <Button className="w-full">Go to My Rentals</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  let session: any = null
  let bookingError: string | null = null
  let createdBooking: any = null

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err: any) {
    console.error("Failed to retrieve Stripe session:", err)
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-destructive/20 bg-card shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Checkout Verification Failed</h1>
          <p className="text-sm text-muted-foreground">
            {err?.message || "Could not retrieve the payment session from Stripe."}
          </p>
          <div className="pt-2">
            <Link href="/equipment">
              <Button variant="outline" className="w-full">Return to Equipment Catalog</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isPaid = session?.payment_status === "paid"

  if (!isPaid) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-amber-500/30 bg-card shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Payment Pending or Incomplete</h1>
          <p className="text-sm text-muted-foreground">
            Your payment status is currently <span className="font-semibold text-foreground">{session?.payment_status}</span>. The booking is only complete once payment is confirmed.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href={session?.url || "/equipment"}>
              <Button className="w-full">Resume Stripe Payment</Button>
            </Link>
            <Link href="/equipment">
              <Button variant="outline" className="w-full">Cancel and Browse Equipment</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Payment is confirmed! Now record booking in database if not already created
  const meta = session.metadata || {}
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.id

  try {
    const bookingPayload = {
      equipmentId: meta.equipmentId,
      equipmentName: meta.equipmentName || "Heavy Equipment",
      equipmentImage: meta.equipmentImage || "",
      rentalPrice: Number(meta.rentalPrice) || 0,
      rentalType: meta.rentalType || "Daily",
      ownerEmail: meta.ownerEmail || "",
      ownerName: meta.ownerName || "",
      userEmail: meta.userEmail || session.customer_email,
      userName: meta.userName || "Customer",
      startDate: meta.startDate,
      endDate: meta.endDate,
      quantity: Number(meta.quantity) || 1,
      contactNumber: meta.contactNumber || "",
      deliveryAddress: meta.deliveryAddress || "",
      additionalNotes: meta.additionalNotes || "",
      totalPrice: Number(meta.totalPrice) || (session.amount_total ? session.amount_total / 100 : 0),
      status: "Confirmed",
      paymentStatus: "Paid",
      transactionId: transactionId,
      stripeSessionId: session.id,
      paidAt: new Date().toISOString(),
    }

    const bookingRes = await createBooking(bookingPayload)
    if (bookingRes.error) {
      console.warn("Notice saving booking:", bookingRes.error)
    } else {
      createdBooking = bookingPayload
    }
  } catch (err: any) {
    console.error("Error creating confirmed booking:", err)
    bookingError = err?.message || null
  }

  const equipmentName = meta.equipmentName || "Heavy Industrial Equipment"
  const equipmentImage = meta.equipmentImage || ""
  const startDate = meta.startDate || "N/A"
  const endDate = meta.endDate || "N/A"
  const quantity = meta.quantity || "1"
  const deliveryAddress = meta.deliveryAddress || "Standard Depot Site"
  const contactNumber = meta.contactNumber || "N/A"
  const amountTotal = session.amount_total
    ? (session.amount_total / 100).toLocaleString("en-US", {
        style: "currency",
        currency: (session.currency || "usd").toUpperCase(),
      })
    : `$${meta.totalPrice || "0"}`

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Stripe Payment Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Booking Complete & Confirmed!
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your payment has been received and verified. The equipment owner has been notified and your reservation is locked in.
            </p>
          </div>
        </div>

        {/* Invoice & Reservation Receipt Card */}
        <Card className="border border-border/80 shadow-md overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">Rental Reservation Receipt</CardTitle>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                {session.id.substring(0, 18)}...
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Equipment Snapshot */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                {equipmentImage ? (
                  <Image
                    src={equipmentImage}
                    alt={equipmentName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-foreground truncate">
                  {equipmentName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Type: <span className="font-medium text-foreground">{meta.rentalType || "Daily"} Rental</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-primary font-semibold">
                  <span>Reserved: {quantity} Unit(s)</span>
                </div>
              </div>
            </div>

            {/* Reservation Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Rental Schedule
                </span>
                <p className="font-semibold text-foreground text-sm pt-0.5">
                  {startDate} &rarr; {endDate}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Delivery / Site Address
                </span>
                <p className="font-semibold text-foreground text-sm truncate pt-0.5" title={deliveryAddress}>
                  {deliveryAddress}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Customer Contact
                </span>
                <p className="font-semibold text-foreground text-sm pt-0.5">
                  {meta.userName || "Customer"} • {contactNumber}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border/50 bg-background/50 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  Payment Status
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Paid & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="border-t border-border/70 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Method</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  Stripe Checkout (Card)
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Stripe Transaction ID</span>
                <span className="font-mono text-[11px] text-foreground select-all">
                  {transactionId}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Paid By</span>
                <span className="font-medium text-foreground">
                  {session.customer_email || meta.userEmail}
                </span>
              </div>
              <div className="pt-2 border-t border-border/70 flex justify-between items-center text-sm font-bold text-foreground">
                <span>Total Amount Paid</span>
                <span className="text-xl font-extrabold text-primary">
                  {amountTotal}
                </span>
              </div>
            </div>

            {/* Customer Guarantee */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2.5">
              <FileCheck2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Your rental order is backed by Rentora&apos;s Escrow Guarantee. Funds are secured safely and only released to the owner according to rental terms.
              </span>
            </div>

            {/* Action Buttons */}
            <CheckoutReceiptActions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
