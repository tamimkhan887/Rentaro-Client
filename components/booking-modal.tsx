"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, ShieldCheck, CheckCircle2, AlertCircle, Loader2, CreditCard, Lock } from "lucide-react"

import { Equipment, BookingInput } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingModalProps {
  equipment: Equipment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BookingModal({
  equipment,
  open,
  onOpenChange,
  onSuccess,
}: BookingModalProps) {
  const router = useRouter()
  const { data: session } = useSession()

  // Format today's date YYYY-MM-DD
  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split("T")[0]
  }, [])

  const defaultEndStr = React.useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }, [])

  const [startDate, setStartDate] = React.useState<string>(todayStr)
  const [endDate, setEndDate] = React.useState<string>(defaultEndStr)
  const [quantity, setQuantity] = React.useState<number>(1)
  const [contactNumber, setContactNumber] = React.useState<string>("")
  const [deliveryAddress, setDeliveryAddress] = React.useState<string>("")
  const [additionalNotes, setAdditionalNotes] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Max available quantity
  const maxQuantity = Math.max(0, Number(equipment.quantity ?? 0))

  // Calculate duration and estimated total
  const { durationDays, unitCount, unitLabel, estimatedTotal } = React.useMemo(() => {
    if (!startDate || !endDate) {
      return { durationDays: 1, unitCount: 1, unitLabel: "day", estimatedTotal: equipment.price * quantity }
    }

    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))

    const rentalType = (equipment.rentalType || "Daily").toLowerCase()
    let count = diffDays
    let label = diffDays === 1 ? "day" : "days"

    if (rentalType.includes("week")) {
      count = Math.max(1, Math.ceil(diffDays / 7))
      label = count === 1 ? "week" : "weeks"
    } else if (rentalType.includes("month")) {
      count = Math.max(1, Math.ceil(diffDays / 30))
      label = count === 1 ? "month" : "months"
    }

    const total = count * equipment.price * quantity
    return {
      durationDays: diffDays,
      unitCount: count,
      unitLabel: label,
      estimatedTotal: total,
    }
  }, [startDate, endDate, equipment.price, equipment.rentalType, quantity])

  // Handle start date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    setStartDate(newStart)
    if (endDate && newStart > endDate) {
      // automatically push end date to same as start date
      setEndDate(newStart)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!session?.user) {
      const equipmentId = equipment._id || equipment.id
      router.push(`/login?callbackUrl=/equipment/${equipmentId}`)
      return
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select both rental start and end dates.")
      return
    }

    if (startDate > endDate) {
      setErrorMessage("Rental End Date cannot be earlier than Rental Start Date.")
      return
    }

    if (maxQuantity <= 0) {
      setErrorMessage("This equipment is currently out of stock and cannot be booked.")
      return
    }

    if (quantity < 1 || quantity > maxQuantity) {
      setErrorMessage(`Please choose a quantity between 1 and ${maxQuantity}.`)
      return
    }

    if (!contactNumber.trim()) {
      setErrorMessage("Please provide a valid contact phone number.")
      return
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage("Please provide a delivery or pickup address.")
      return
    }

    setIsSubmitting(true)

    try {
      const checkoutPayload = {
        equipmentId: (equipment._id || equipment.id || "") as string,
        equipmentName: equipment.name,
        equipmentImage: equipment.imageUrl || "",
        rentalPrice: equipment.price,
        rentalType: equipment.rentalType || "Daily",
        ownerEmail: equipment.ownerEmail || "",
        ownerName: equipment.ownerName || "",
        userEmail: session.user.email || "",
        userName: session.user.name || "Customer",
        startDate,
        endDate,
        quantity,
        contactNumber: contactNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        additionalNotes: additionalNotes.trim(),
        totalPrice: estimatedTotal,
      }

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutPayload),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Failed to initialize Stripe checkout")
        return
      }

      if (data.url) {
        toast.add({
          title: "Redirecting to Stripe Checkout...",
          description: "Please complete your card payment on Stripe to finalize this booking.",
          type: "info",
        })
        window.location.href = data.url
      } else {
        setErrorMessage("Stripe payment session URL was not returned.")
      }
    } catch (err) {
      console.error("Stripe Booking error:", err)
      setErrorMessage("An unexpected error occurred while connecting to Stripe.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>Book Equipment</span>
          </DialogTitle>
          <DialogDescription>
            Specify your rental period, delivery details, and notes to reserve this equipment.
          </DialogDescription>
        </DialogHeader>

        {/* Equipment summary preview */}
        <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-xl border border-border/50">
          <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
            {equipment.imageUrl ? (
              <Image
                src={equipment.imageUrl}
                alt={equipment.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground text-sm truncate">
              {equipment.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {equipment.location}
              </span>
              <span>•</span>
              <span className="font-medium text-primary">
                ${equipment.price}/{equipment.rentalType}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Available: <span className="font-semibold text-foreground">{maxQuantity} unit(s)</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Dates & Quantity in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs font-semibold">
                Rental Start Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-xs font-semibold">
                Rental End Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-xs font-semibold">
                Required Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min={maxQuantity > 0 ? 1 : 0}
                max={maxQuantity}
                disabled={maxQuantity <= 0}
                value={maxQuantity > 0 ? quantity : 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  setQuantity(isNaN(val) ? 1 : Math.max(1, Math.min(maxQuantity, val)))
                }}
                required
                className="w-full text-sm"
              />
              <p className={`text-[11px] ${maxQuantity <= 0 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                {maxQuantity > 0 ? `Max ${maxQuantity} unit(s) available` : "Out of stock (0 available)"}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactNumber" className="text-xs font-semibold">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="w-full text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliveryAddress" className="text-xs font-semibold">
              Delivery Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deliveryAddress"
              placeholder="Full site or delivery address (Street, City, Postal Code)"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="additionalNotes" className="text-xs font-semibold">
              Additional Notes <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="Special instructions, delivery access notes, operator requests..."
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full text-sm resize-none"
            />
          </div>

          {/* Pricing summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Rental Duration:</span>
              <span className="font-medium text-foreground">
                {durationDays} day(s) ({unitCount} {unitLabel})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Rate:</span>
              <span className="font-medium text-foreground">
                ${equipment.price} per {equipment.rentalType} × {quantity} unit(s)
              </span>
            </div>
            <div className="pt-2 border-t border-primary/20 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Estimated Total</span>
              <span className="text-lg font-bold text-primary">
                ${estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stripe Pay First Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/20 text-xs text-[#635BFF] dark:text-[#8881ff]">
            <Lock className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Payment Required to Complete Booking</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                You will be redirected to Stripe to pay securely. Once payment is confirmed, your booking is officially complete and confirmed.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 items-center">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Free cancellation up to 24h before start date</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || maxQuantity <= 0}
                className="w-full sm:w-auto text-sm gap-2 bg-[#635BFF] hover:bg-[#5349e4] text-white shadow font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : maxQuantity <= 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Pay with Stripe & Book (${estimatedTotal.toLocaleString()})</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
