"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Package,
  ArrowRight,
  Loader2,
  Sparkles,
  ShoppingBag,
  Search,
} from "lucide-react"

import { FavoriteItem } from "@/types/equipment"
import { useSession } from "@/lib/auth-client"
import { getUserFavorites, removeFavoriteById, removeFromFavorites } from "@/lib/api/favorites"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"

export default function CustomerFavoritesPage() {
  const { data: session, isPending } = useSession()
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [removingId, setRemovingId] = React.useState<string | null>(null)

  // Fetch favorites on mount or when session is available
  React.useEffect(() => {
    if (isPending) return

    if (!session?.user?.email) {
      setIsLoading(false)
      return
    }

    let isMounted = true
    const fetchFavorites = async () => {
      try {
        setIsLoading(true)
        const data = await getUserFavorites(session.user.email)
        if (isMounted) {
          setFavorites(data || [])
        }
      } catch (err) {
        console.error("Error fetching favorites:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFavorites()
    return () => {
      isMounted = false
    }
  }, [session?.user?.email, isPending])

  // Remove item from favorites
  const handleRemove = async (fav: FavoriteItem) => {
    const idToRemove = fav._id || fav.id
    if (!idToRemove && !fav.equipmentId) return

    setRemovingId(idToRemove || fav.equipmentId)

    // Optimistic removal
    const previous = [...favorites]
    setFavorites((prev) =>
      prev.filter((item) => (item._id || item.id) !== idToRemove)
    )

    try {
      if (idToRemove) {
        await removeFavoriteById(idToRemove)
      } else if (session?.user?.email && fav.equipmentId) {
        await removeFromFavorites(session.user.email, fav.equipmentId)
      }

      toast.add({
        title: "Removed from Favorites",
        description: `${fav.equipment?.name || "Equipment"} was removed from your favorites list.`,
        type: "info",
      })
    } catch (err) {
      console.error("Failed to remove favorite:", err)
      setFavorites(previous) // Revert
      toast.add({
        title: "Error",
        description: "Failed to remove item from favorites. Please try again.",
        type: "error",
      })
    } finally {
      setRemovingId(null)
    }
  }

  // Filtered list based on search query
  const filteredFavorites = React.useMemo(() => {
    if (!searchQuery.trim()) return favorites
    const q = searchQuery.toLowerCase().trim()
    return favorites.filter((fav) => {
      const eq = fav.equipment
      if (!eq) return false
      return (
        eq.name?.toLowerCase().includes(q) ||
        eq.category?.toLowerCase().includes(q) ||
        eq.location?.toLowerCase().includes(q) ||
        eq.brand?.toLowerCase().includes(q)
      )
    })
  }, [favorites, searchQuery])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              My Saved Favorites
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {favorites.length} {favorites.length === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Keep track of equipment you are interested in renting and quickly book when needed.
          </p>
        </div>

        <Link href="/equipment">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <ShoppingBag className="h-4 w-4" />
            <span>Browse More Equipment</span>
          </Button>
        </Link>
      </div>

      {/* Search Bar when items exist */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved equipment by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Content Area */}
      {isLoading || isPending ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading your saved favorites...</p>
        </div>
      ) : !session?.user ? (
        <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Heart className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-lg font-bold text-foreground">Sign In to View Favorites</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Please sign in to your Rentora customer account to view and manage your saved equipment.
            </p>
          </div>
          <Link href="/login?callbackUrl=/dashboard/customer/favorites">
            <Button size="sm" className="gap-2">
              <span>Sign In Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-4">
          <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Heart className="h-8 w-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-lg font-bold text-foreground">Your Favorites List is Empty</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You haven&apos;t added any equipment to your favorites list yet. When viewing any equipment item, click the &ldquo;Add to Favorites&rdquo; button to save it here for quick booking.
            </p>
          </div>
          <Link href="/equipment">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Explore Equipment Directory</span>
            </Button>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground space-y-2">
          <p className="text-sm">No favorites matched your search query &ldquo;{searchQuery}&rdquo;.</p>
          <Button variant="link" size="sm" onClick={() => setSearchQuery("")}>
            Reset search filter
          </Button>
        </div>
      ) : (
        /* Grid of Favorites */
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredFavorites.map((fav) => {
              const eq = fav.equipment
              if (!eq) return null
              const eqId = eq._id || eq.id || fav.equipmentId
              const favId = fav._id || fav.id
              const isRemoving = removingId === favId || removingId === fav.equipmentId

              return (
                <motion.div
                  key={favId || eqId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                    {eq.imageUrl ? (
                      <Image
                        src={eq.imageUrl}
                        alt={eq.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                        No image available
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-background/90 text-foreground backdrop-blur-md shadow-sm border border-border/40">
                        {eq.category}
                      </span>
                    </div>

                    {/* Remove button overlay */}
                    <button
                      onClick={() => handleRemove(fav)}
                      disabled={isRemoving}
                      title="Remove from favorites"
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 hover:bg-destructive hover:text-white text-muted-foreground backdrop-blur-md shadow-sm flex items-center justify-center transition-colors cursor-pointer border border-border/40"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate max-w-[150px] font-medium">
                          {eq.brand || "Industrial"}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {eq.quantity > 0 ? `${eq.quantity} Available` : "Out of Stock"}
                        </span>
                      </div>

                      <h3 className="font-bold text-foreground text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {eq.name}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {eq.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{eq.location}</span>
                      </div>
                    </div>

                    {/* Card Footer: Price & Action */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                          ${eq.price}
                          <span className="text-xs font-normal text-muted-foreground">
                            /{eq.rentalType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link href={`/equipment/${eqId}`}>
                          <Button size="sm" className="text-xs gap-1.5 h-8">
                            <span>View Details</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
