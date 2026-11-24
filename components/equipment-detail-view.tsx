"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Heart,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Share2,
  User,
  Mail,
  Award,
  ChevronRight,
  FileText,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  Info,
} from "lucide-react"

import { Equipment } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { checkIsFavorite, addToFavorites, removeFromFavorites } from "@/lib/api/favorites"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { BookingModal } from "@/components/booking-modal"

interface EquipmentDetailViewProps {
  equipment: Equipment
}

export function EquipmentDetailView({ equipment }: EquipmentDetailViewProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const equipmentId = (equipment._id || equipment.id || "") as string
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false)
  const [isFavLoading, setIsFavLoading] = React.useState<boolean>(false)
  const [isBookingOpen, setIsBookingOpen] = React.useState<boolean>(false)

  // Check initial favorite status
  React.useEffect(() => {
    if (!session?.user?.email || !equipmentId) return

    let isMounted = true
    const fetchFavoriteStatus = async () => {
      try {
        const res = await checkIsFavorite(session.user.email, equipmentId)
        if (isMounted) {
          setIsFavorite(res.isFavorite)
        }
      } catch (err) {
        console.error("Error checking favorite status:", err)
      }
    }

    fetchFavoriteStatus()
    return () => {
      isMounted = false
    }
  }, [session?.user?.email, equipmentId])

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${equipmentId}`)
      return
    }

    setIsFavLoading(true)
    const prev = isFavorite
    setIsFavorite(!prev) // Optimistic update

    try {
      if (prev) {
        await removeFromFavorites(session.user.email, equipmentId)
        toast.add({
          title: "Removed from Favorites",
          description: `${equipment.name} has been removed from your saved items.`,
          type: "info",
        })
      } else {
        await addToFavorites({
          userEmail: session.user.email,
          equipmentId,
          equipment,
        })
        toast.add({
          title: "Added to Favorites!",
          description: `${equipment.name} was added to your favorites list.`,
          type: "success",
        })
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
      setIsFavorite(prev) // Revert
      toast.add({
        title: "Action Failed",
        description: "Could not update your favorites. Please try again.",
        type: "error",
      })
    } finally {
      setIsFavLoading(false)
    }
  }

  // Open booking modal
  const handleBookNow = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${equipmentId}`)
      return
    }
    setIsBookingOpen(true)
  }

  // Share link
  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        toast.add({
          title: "Link Copied!",
          description: "Equipment page link copied to your clipboard.",
          type: "success",
        })
      }
    } catch {
      toast.add({
        title: "Could not copy",
        description: "Please copy the URL directly from your browser.",
        type: "info",
      })
    }
  }

  const isAvailable = (equipment.quantity || 0) > 0

  return (
    <div className="min-h-screen bg-background pb-16 pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 overflow-x-auto py-1">
          <Link href="/" className="hover:text-foreground transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href="/equipment" className="hover:text-foreground transition-colors shrink-0">
            All Equipment
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-muted-foreground shrink-0">{equipment.category}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
            {equipment.name}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Equipment Directory</span>
          </Link>
        </div>

        {/* Main Grid: Left Column (Images, Specs, Details), Right Column (Sticky Booking Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7-8 COLS */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-sm group"
            >
              {equipment.imageUrl ? (
                <Image
                  src={equipment.imageUrl}
                  alt={equipment.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Package className="h-12 w-12 stroke-[1.5]" />
                  <span>No image available</span>
                </div>
              )}

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 text-foreground backdrop-blur-md shadow-sm border border-border/50">
                  {equipment.category}
                </span>
                {equipment.condition && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-md shadow-sm">
                    {equipment.condition}
                  </span>
                )}
              </div>

              {/* Status Tag */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                    isAvailable
                      ? "bg-emerald-500/90 text-white"
                      : "bg-destructive/90 text-destructive-foreground"
                  }`}
                >
                  {isAvailable ? `${equipment.quantity} Available` : "Currently Unavailable"}
                </span>
              </div>
            </motion.div>

            {/* Title, Brand, Model & Location Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-primary mb-1">
                    <span>{equipment.brand || "Industrial Grade"}</span>
                    {equipment.model && (
                      <>
                        <span>•</span>
                        <span className="text-muted-foreground">{equipment.model}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                    {equipment.name}
                  </h1>
                </div>

                {/* Share action */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 text-xs rounded-lg"
                    title="Share equipment"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              {/* Location & Quick Meta */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-muted-foreground border-y border-border/60 py-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{equipment.location}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>Rental Basis: <strong className="text-foreground">{equipment.rentalType}</strong></span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-primary shrink-0" />
                  <span>Available Stock: <strong className="text-foreground">{equipment.quantity} units</strong></span>
                </div>
              </div>
            </motion.div>

            {/* Key Specifications Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span>Equipment Specifications</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Brand</span>
                  <span className="text-sm font-semibold text-foreground">
                    {equipment.brand || "Industrial"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Model</span>
                  <span className="text-sm font-semibold text-foreground">
                    {equipment.model || "Commercial Std"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Condition</span>
                  <span className="text-sm font-semibold text-foreground">
                    {equipment.condition || "Certified Working"}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Category</span>
                  <span className="text-sm font-semibold text-foreground">
                    {equipment.category}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Billing Rate</span>
                  <span className="text-sm font-semibold text-foreground">
                    ${equipment.price} / {equipment.rentalType}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/60">
                  <span className="text-xs text-muted-foreground block mb-0.5">Deposit & Inspection</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Verified Ready
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Description & Features</span>
              </h2>
              <div className="p-5 rounded-2xl border border-border/70 bg-card/60 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {equipment.description || "No specific description provided by the owner."}
              </div>
            </motion.div>

            {/* Rental Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Rental Terms & Conditions</span>
              </h2>
              <div className="p-5 rounded-2xl border border-border/70 bg-card/60 space-y-4">
                {equipment.terms ? (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground leading-relaxed">
                    <p className="font-medium mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Owner Terms:
                    </p>
                    <p>{equipment.terms}</p>
                  </div>
                ) : null}

                {/* Standard platform terms bullet list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Valid government photo ID and booking confirmation required upon handover.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Refundable security deposit may apply based on equipment classification.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Standard maintenance inspection performed prior to and following every rental.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Free cancellation available up to 24 hours prior to the reserved start date.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Equipment Owner</span>
              </h2>
              <div className="p-5 rounded-2xl border border-border/70 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {equipment.ownerName ? equipment.ownerName[0]?.toUpperCase() : "O"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-base sm:text-lg">
                        {equipment.ownerName || "Verified Equipment Partner"}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Award className="h-3 w-3" />
                        Verified Owner
                      </span>
                    </div>
                    {equipment.ownerEmail && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{equipment.ownerEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Typical response time: Under 1 hour</span>
                    </div>
                  </div>
                </div>

                <div className="sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs"
                    onClick={() => {
                      if (equipment.ownerEmail) {
                        window.location.href = `mailto:${equipment.ownerEmail}?subject=Inquiry regarding ${encodeURIComponent(equipment.name)}`
                      } else {
                        toast.add({
                          title: "Contact Owner",
                          description: "Owner can be reached during the booking confirmation process.",
                          type: "info",
                        })
                      }
                    }}
                  >
                    Contact Owner
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT 4 COLS: STICKY BOOKING CARD */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-6"
            >
              {/* Pricing Display */}
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                  Rental Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    ${equipment.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / {equipment.rentalType}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tax, maintenance and local dispatch included
                </p>
              </div>

              {/* In Stock & Dispatch */}
              <div className="space-y-2 border-t border-border/60 pt-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-semibold ${isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                    {isAvailable ? `${equipment.quantity} In Stock` : "Out of Stock"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Depot Location</span>
                  <span className="font-semibold text-foreground truncate max-w-[170px]">
                    {equipment.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Damage Protection</span>
                  <span className="font-semibold text-foreground">Complimentary</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleBookNow}
                  disabled={!isAvailable}
                  className="w-full text-sm font-semibold h-11 gap-2 shadow-sm"
                  size="lg"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{isAvailable ? "Book Equipment Now" : "Currently Unavailable"}</span>
                </Button>

                <Button
                  variant={isFavorite ? "secondary" : "outline"}
                  onClick={handleToggleFavorite}
                  disabled={isFavLoading}
                  className={`w-full text-xs font-semibold h-10 gap-2 transition-all ${
                    isFavorite
                      ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-300 dark:border-rose-900"
                      : ""
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                    }`}
                  />
                  <span>
                    {isFavLoading
                      ? "Updating..."
                      : isFavorite
                      ? "Saved in Favorites"
                      : "Add to Favorites"}
                  </span>
                </Button>
              </div>

              {/* Platform Guarantee Callouts */}
              <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Verified condition by certified field inspectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Secure escrow payment release</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0" />
                  <span>Instant digital rental agreement upon booking</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        equipment={equipment}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        onSuccess={() => {
          // Booking successful
        }}
      />
    </div>
  )
}
