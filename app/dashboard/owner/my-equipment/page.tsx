"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Boxes,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react"

import { Equipment, EQUIPMENT_CATEGORIES } from "@/types/equipment"
import { authClient } from "@/lib/auth-client"
import { getOwnerEquipments, deleteEquipment, updateEquipment } from "@/lib/api/ownerEquipment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

// Category Badge Color Mapping
const categoryColorMap: Record<string, string> = {
  "Construction Equipment":
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
  "Photography Equipment":
    "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30",
  "Vehicles & Transportation":
    "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
  "Agriculture Equipment":
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
  "Electronics":
    "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",
  "Event Equipment":
    "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
}

const rentalTypes = ["Daily", "Weekly", "Monthly"] as const

export default function OwnerMyEquipmentPage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession()
  const user = session?.user

  const [equipments, setEquipments] = React.useState<Equipment[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Delete modal state
  const [equipmentToDelete, setEquipmentToDelete] = React.useState<Equipment | null>(null)
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false)

  // Update modal state
  const [equipmentToUpdate, setEquipmentToUpdate] = React.useState<Equipment | null>(null)
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const [updateFormData, setUpdateFormData] = React.useState<{
    name: string
    category: string
    price: number
    rentalType: string
    quantity: number
    condition: string
    location: string
    brand: string
    model: string
    imageUrl: string
    description: string
  }>({
    name: "",
    category: "Construction Equipment",
    price: 0,
    rentalType: "Daily",
    quantity: 1,
    condition: "Good",
    location: "",
    brand: "",
    model: "",
    imageUrl: "",
    description: "",
  })

  // Fetch owner's equipment
  const fetchEquipments = React.useCallback(async () => {
    if (!user?.email) return
    try {
      setIsLoading(true)
      const data = await getOwnerEquipments(user.email)
      setEquipments(data || [])
    } catch (err) {
      console.error("Error fetching owner equipments:", err)
      toast.add({
        title: "Error Loading Fleet",
        description: "Could not fetch your equipment listings. Please refresh.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  React.useEffect(() => {
    if (user?.email) {
      fetchEquipments()
    } else if (!isSessionLoading) {
      setIsLoading(false)
    }
  }, [user?.email, isSessionLoading, fetchEquipments])

  // Open Update Modal and prefill data
  const handleOpenUpdate = (item: Equipment) => {
    setEquipmentToUpdate(item)
    setUpdateFormData({
      name: item.name || "",
      category: item.category || "Construction Equipment",
      price: item.price || 0,
      rentalType: item.rentalType || "Daily",
      quantity: item.quantity || 1,
      condition: item.condition || "Good",
      location: item.location || "",
      brand: item.brand || "",
      model: item.model || "",
      imageUrl: item.imageUrl || "",
      description: item.description || "",
    })
  }

  // Submit Update
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!equipmentToUpdate) return

    const id = equipmentToUpdate._id || equipmentToUpdate.id
    if (!id) return

    setIsUpdating(true)
    try {
      const res = await updateEquipment(id, updateFormData)
      if (res.success) {
        toast.add({
          title: "Equipment Updated",
          description: `${updateFormData.name} has been updated successfully.`,
          type: "success",
        })
        // Optimistically update list
        setEquipments((prev) =>
          prev.map((eq) =>
            (eq._id || eq.id) === id ? { ...eq, ...updateFormData } : eq
          )
        )
        setEquipmentToUpdate(null)
      } else {
        toast.add({
          title: "Update Failed",
          description: res.error || "Could not save equipment changes.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Update error:", err)
      toast.add({
        title: "Update Error",
        description: "An unexpected error occurred while updating.",
        type: "error",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!equipmentToDelete) return
    const id = equipmentToDelete._id || equipmentToDelete.id
    if (!id) return

    setIsDeleting(true)
    try {
      const res = await deleteEquipment(id)
      if (res.success) {
        toast.add({
          title: "Equipment Deleted",
          description: `${equipmentToDelete.name} has been removed from your fleet.`,
          type: "info",
        })
        setEquipments((prev) => prev.filter((eq) => (eq._id || eq.id) !== id))
        setEquipmentToDelete(null)
      } else {
        toast.add({
          title: "Deletion Failed",
          description: "Could not remove equipment from database.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Delete error:", err)
      toast.add({
        title: "Delete Error",
        description: "An unexpected error occurred while deleting.",
        type: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtered equipments
  const filteredEquipments = React.useMemo(() => {
    return equipments.filter((eq) => {
      // Status filter
      const itemStatus = (eq.status || "Pending").toLowerCase()
      if (statusFilter !== "all" && itemStatus !== statusFilter.toLowerCase()) {
        return false
      }

      // Search query filter
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      return (
        eq.name?.toLowerCase().includes(q) ||
        eq.category?.toLowerCase().includes(q) ||
        eq.location?.toLowerCase().includes(q) ||
        eq.brand?.toLowerCase().includes(q)
      )
    })
  }, [equipments, searchQuery, statusFilter])

  // Count metrics
  const totalCount = equipments.length
  const approvedCount = equipments.filter(
    (e) => (e.status || "").toLowerCase() === "approved"
  ).length
  const pendingCount = equipments.filter(
    (e) => (e.status || "Pending").toLowerCase() === "pending"
  ).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My Equipment Fleet
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {totalCount} {totalCount === 1 ? "listing" : "listings"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Manage your registered equipment, track approval statuses, update pricing, and modify listings.
          </p>
        </div>

        <Link href="/dashboard/owner/add-equipment">
          <Button size="sm" className="gap-2 font-semibold shadow-xs">
            <PlusCircle className="size-4" />
            <span>Add New Equipment</span>
          </Button>
        </Link>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Listings</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{totalCount}</h3>
            </div>
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Boxes className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">All equipment in your fleet</p>
        </Card>

        <Card className="p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Approved & Live</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {approvedCount}
              </h3>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Visible to all renters in directory</p>
        </Card>

        <Card className="p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {pendingCount}
              </h3>
            </div>
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Default status awaiting admin approval</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by equipment name, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
            Status:
          </span>
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            {["all", "Approved", "Pending"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st === "all" ? "All" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <Card className="border-border/70 overflow-hidden shadow-xs">
        {isLoading || isSessionLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading your equipment listings...</p>
          </div>
        ) : equipments.length === 0 ? (
          /* Empty State: No equipment added yet */
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Boxes className="size-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg font-bold text-foreground">No Equipment Listed Yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You haven&apos;t added any machinery or tools to your Rentora fleet. List your first equipment to start generating rental income.
              </p>
            </div>
            <Link href="/dashboard/owner/add-equipment">
              <Button size="sm" className="gap-2 font-semibold">
                <PlusCircle className="size-4" />
                <span>Add Your First Equipment</span>
              </Button>
            </Link>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground space-y-2 p-4">
            <p className="text-sm">No equipment matched your filters.</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          /* Responsive Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Equipment Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Rental Price</th>
                  <th className="py-3.5 px-4">Available Quantity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEquipments.map((item) => {
                  const id = item._id || item.id || ""
                  const status = item.status || "Pending"
                  const isApproved = status.toLowerCase() === "approved"
                  const isPendingStatus = status.toLowerCase() === "pending"
                  const isRejected = status.toLowerCase() === "rejected"

                  return (
                    <tr
                      key={id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* 1. Equipment Name (with Image & Meta) */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 sm:size-14 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/60">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-muted-foreground">
                                <Package className="size-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {item.brand && (
                                <span className="truncate">{item.brand}</span>
                              )}
                              {item.model && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{item.model}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="size-3 text-primary shrink-0" />
                                {item.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            categoryColorMap[item.category] ||
                            "bg-muted text-muted-foreground border-border/60"
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* 3. Rental Price */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-foreground text-sm">
                          ${item.price}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            /{item.rentalType || "Daily"}
                          </span>
                        </div>
                      </td>

                      {/* 4. Available Quantity */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {item.quantity} unit{item.quantity === 1 ? "" : "s"}
                          </span>
                          <span
                            className={`inline-block size-2 rounded-full ${
                              item.quantity > 0 ? "bg-emerald-500" : "bg-destructive"
                            }`}
                          />
                        </div>
                      </td>

                      {/* 5. Status (default Pending) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isApproved
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : isRejected
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-500"
                                : isRejected
                                ? "bg-destructive"
                                : "bg-amber-500"
                            }`}
                          />
                          <span>{status}</span>
                        </span>
                      </td>

                      {/* 6. Actions (Update, Delete, View Details) */}
                      <td className="py-4 px-4 whitespace-nowrap text-right pr-6">
                        <div className="inline-flex items-center gap-1.5">
                          {/* 1. Update Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUpdate(item)}
                            className="h-8 px-2.5 text-xs gap-1 hover:border-primary/50"
                            title="Update equipment"
                          >
                            <Pencil className="size-3.5" />
                            <span>Update</span>
                          </Button>

                          {/* 2. Delete Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEquipmentToDelete(item)}
                            className="h-8 px-2.5 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                            title="Delete equipment"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </Button>

                          {/* 3. View Details Button */}
                          <Link href={`/equipment/${id}`}>
                            <Button
                              size="sm"
                              className="h-8 px-2.5 text-xs gap-1 shadow-xs"
                              title="View details page"
                            >
                              <Eye className="size-3.5" />
                              <span>View Details</span>
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ======================================================== */}
      {/* UPDATE EQUIPMENT MODAL */}
      {/* ======================================================== */}
      <Dialog
        open={!!equipmentToUpdate}
        onOpenChange={(open) => {
          if (!open) setEquipmentToUpdate(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="size-5 text-primary" />
              <span>Update Equipment Listing</span>
            </DialogTitle>
            <DialogDescription>
              Modify pricing, stock availability, category, and specifications for this machine.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUpdate} className="space-y-4 pt-2">
            {/* Equipment Name */}
            <div className="space-y-1.5">
              <Label htmlFor="update-name" className="text-xs font-semibold">
                Equipment Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-name"
                value={updateFormData.name}
                onChange={(e) =>
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
                }
                required
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Category & Rental Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="update-category" className="text-xs font-semibold">
                  Category <span className="text-destructive">*</span>
                </Label>
                <select
                  id="update-category"
                  value={updateFormData.category}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, category: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-popover text-popover-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="update-rentalType" className="text-xs font-semibold">
                  Rental Type <span className="text-destructive">*</span>
                </Label>
                <select
                  id="update-rentalType"
                  value={updateFormData.rentalType}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, rentalType: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {rentalTypes.map((rt) => (
                    <option key={rt} value={rt} className="bg-popover text-popover-foreground">
                      {rt} Rate
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rental Price & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="update-price" className="text-xs font-semibold">
                  Rental Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-price"
                  type="number"
                  min="0"
                  step="any"
                  value={updateFormData.price}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="update-quantity" className="text-xs font-semibold">
                  Available Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-quantity"
                  type="number"
                  min="0"
                  value={updateFormData.quantity}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      quantity: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  required
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Brand, Model, Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="update-brand" className="text-xs font-semibold">
                  Brand
                </Label>
                <Input
                  id="update-brand"
                  placeholder="e.g. Caterpillar"
                  value={updateFormData.brand}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, brand: e.target.value })
                  }
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="update-model" className="text-xs font-semibold">
                  Model
                </Label>
                <Input
                  id="update-model"
                  placeholder="e.g. 308 CR Mini"
                  value={updateFormData.model}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, model: e.target.value })
                  }
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="update-condition" className="text-xs font-semibold">
                  Condition
                </Label>
                <Input
                  id="update-condition"
                  placeholder="e.g. Excellent / Like New"
                  value={updateFormData.condition}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, condition: e.target.value })
                  }
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Location & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="update-location" className="text-xs font-semibold">
                  Depot Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="update-location"
                  placeholder="e.g. Miami, FL"
                  value={updateFormData.location}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, location: e.target.value })
                  }
                  required
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="update-image" className="text-xs font-semibold">
                  Image URL
                </Label>
                <Input
                  id="update-image"
                  type="url"
                  placeholder="https://..."
                  value={updateFormData.imageUrl}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, imageUrl: e.target.value })
                  }
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="update-description" className="text-xs font-semibold">
                Description
              </Label>
              <Textarea
                id="update-description"
                rows={3}
                value={updateFormData.description}
                onChange={(e) =>
                  setUpdateFormData({ ...updateFormData, description: e.target.value })
                }
                className="text-xs sm:text-sm resize-none"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEquipmentToUpdate(null)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
                className="gap-2 font-semibold"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      <Dialog
        open={!!equipmentToDelete}
        onOpenChange={(open) => {
          if (!open) setEquipmentToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete Equipment Listing?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                {equipmentToDelete?.name}
              </strong>
              ? This action cannot be undone and will remove the machine from the marketplace.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEquipmentToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="gap-2 font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Delete Equipment</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
