"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  HardHat,
  PlusCircle,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Boxes,
  Tag,
  Clock,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { createEquipment } from "@/lib/actions/createEquipment"

// Curated equipment categories for Rentora marketplace
const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const

const rentalTypes = [
  { value: "Daily", label: "Daily Rate" },
  { value: "Weekly", label: "Weekly Rate" },
  { value: "Monthly", label: "Monthly Rate" },
] as const

const conditions = [
  "Brand New (0-100 Hours)",
  "Excellent (Like New)",
  "Good (Field Tested & Inspected)",
  "Fair (Fully Operational)",
] as const

export default function OwnerAddEquipmentPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "Construction Equipment",
    location: "",
    price: "",
    rentalType: "Daily",
    quantity: "1",
    condition: "Excellent (Like New)",
    brand: "",
    model: "",
    imageUrl: "",
    terms:
      "A valid construction license is required. 20% refundable security deposit upon handover. Operator maintenance policy applies.",
    status: "Pending",
    ownerName: "",
    ownerEmail: "",
  })

  // Populate owner details once session loads
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ownerName: user.name || "Fleet Owner",
        ownerEmail: user.email || "",
      }))
    }
  }, [user])

  const [imageError, setImageError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "imageUrl") {
      setImageError(false)
    }
  }

  // Reset form handler
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      category: "Construction Equipment",
      location: "",
      price: "",
      rentalType: "Daily",
      quantity: "1",
      condition: "Excellent (Like New)",
      brand: "",
      model: "",
      imageUrl: "",
      terms:
        "A valid construction license is required. 20% refundable security deposit upon handover. Operator maintenance policy applies.",
      status: "Pending",
      ownerName: user?.name || "Fleet Owner",
      ownerEmail: user?.email || "",
    })
    setImageError(false)
    toast.add({
      title: "Form Cleared",
      description: "All fields have been reset to default values.",
      type: "info",
    })
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Required field validation
    if (!formData.name.trim()) {
      toast.add({
        title: "Equipment Name Required",
        description: "Please enter the title or machinery model name.",
        type: "error",
      })
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.add({
        title: "Rental Price Required",
        description: "Please provide a valid rental price in USD.",
        type: "error",
      })
      return
    }

    if (!formData.location.trim()) {
      toast.add({
        title: "Depot Location Required",
        description: "Please specify where this equipment is stationed.",
        type: "error",
      })
      return
    }

    setIsSubmitting(true)

    const submissionPayload = {
      ...formData,
      price: Number(formData.price),
      quantity: Math.max(1, parseInt(formData.quantity, 10) || 1),
      status: "Pending",
      createdAt: new Date().toISOString(),
    }
    const data = await createEquipment(submissionPayload);
    if (data.insertedId) {
      toast.add({
        title: "Equipment Submitted Successfully!",
        type: "success",
      })
      setTimeout(() => {
        setIsSubmitting(false)
      }, 400)
    }



  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/owner"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[#e77952] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Owner Overview</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
          <HardHat className="size-3.5" />
          <span>Fleet Owner Portal</span>
        </div>
      </div>

      {/* Main Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          List New Equipment
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Publish a machine, excavator, crane, or industrial tool to the Rentora fleet. Once submitted, your equipment will be marked as <span className="font-semibold text-amber-600 dark:text-amber-400">Pending</span> for admin verification.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xs backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#e77952]/10 text-[#e77952]">
                <Boxes className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Basic Machinery Information
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Primary specifications and identification of the machine
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Equipment Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Equipment Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
                value={formData.name}
                onChange={handleChange}
                className="h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
              />
            </div>

            {/* Brand, Model & Condition Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Brand / Manufacturer
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="brand"
                    name="brand"
                    type="text"
                    placeholder="e.g. Caterpillar, Komatsu, JCB"
                    value={formData.brand}
                    onChange={handleChange}
                    className="pl-9.5 h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="model" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Model Number / Series
                </Label>
                <Input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="e.g. CAT-320D L"
                  value={formData.model}
                  onChange={handleChange}
                  className="h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="condition" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Equipment Condition
                </Label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full h-10.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 px-3 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#e77952] focus:ring-2 focus:ring-[#e77952]/20 outline-hidden transition-all cursor-pointer"
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Machinery Category <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-10.5 pl-9.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 pr-4 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#e77952] focus:ring-2 focus:ring-[#e77952]/20 outline-hidden transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Detailed Equipment Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe machine performance, engine horsepower, attachments included, operational capabilities, and fuel requirements..."
                value={formData.description}
                onChange={handleChange}
                className="rounded-xl min-h-24 bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Pricing, Rental Type, Location & Inventory */}
        <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xs backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Pricing & Availability
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Set your rental terms, pricing structure, and depot location
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rental Price in Dollars */}
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Rental Price (USD) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">
                    $
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="350.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-8 h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                  />
                </div>
              </div>

              {/* Rental Type (Daily, Weekly, Monthly) */}
              <div className="space-y-1.5">
                <Label htmlFor="rentalType" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Billing Cycle (Rental Type)
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <select
                    id="rentalType"
                    name="rentalType"
                    value={formData.rentalType}
                    onChange={handleChange}
                    className="w-full h-10.5 pl-9.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 pr-4 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#e77952] outline-hidden cursor-pointer"
                  >
                    {rentalTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} ({t.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Available Fleet Quantity
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Equipment Location / Depot Address <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="e.g. Tejgaon Industrial Area, Yard #4, Dhaka"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-9.5 h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Equipment Image URL & Preview */}
        <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xs backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ImageIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Machinery Media & Image
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Provide a direct image URL to showcase your machine to customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Image Direct URL
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="pl-9.5 h-10.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                Enter a direct image link (PNG, JPG, or WebP). A live preview will render below.
              </p>
            </div>

            {/* Live Image Preview Area */}
            <div className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/30 p-4">
              <p className="text-xs font-semibold text-neutral-500 mb-2">Live Image Preview:</p>

              {formData.imageUrl && !imageError ? (
                <div className="relative aspect-video w-full max-w-md mx-auto rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt={formData.name || "Equipment Preview"}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-400">
                  <div className="size-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                    <ImageIcon className="size-6 text-neutral-400" />
                  </div>
                  <p className="text-xs font-medium text-neutral-500">
                    {imageError
                      ? "Unable to load image from URL. Please check the link."
                      : "No image URL entered yet"}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Paste an image URL above to verify its preview before publishing.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Terms and Conditions */}
        <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xs backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileText className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Rental Terms & Conditions
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  State security deposit requirements, operator rules, and damage liability
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-1.5">
              <Label htmlFor="terms" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Agreement Terms
              </Label>
              <Textarea
                id="terms"
                name="terms"
                rows={3}
                value={formData.terms}
                onChange={handleChange}
                placeholder="Specify security deposit percentage, insurance coverage, machine return condition, and late fees..."
                className="rounded-xl min-h-20 bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Owner Information & Status (Read Only / Pre-filled) */}
        <Card className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xs backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-850/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Owner Identity & Moderation Status
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                  Listing ownership details and verification badge
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Owner Name */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerName" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Owner Name (Pre-filled)
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    readOnly
                    value={formData.ownerName}
                    className="pl-9.5 h-10.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Owner Email */}
              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail" className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Owner Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <Input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    readOnly
                    value={formData.ownerEmail}
                    className="pl-9.5 h-10.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status (Pending) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Listing Status
                </Label>
                <div className="flex items-center h-10.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-2">
                  <Clock className="size-4 shrink-0" />
                  <span className="text-xs font-semibold">Pending (Awaiting Verification)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="w-full sm:w-auto h-11 px-6 rounded-xl border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <RotateCcw className="size-4 mr-2" />
            <span>Reset Fields</span>
          </Button>

          <Button
            type="submit"
            variant="brand"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 px-8 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="size-4 mr-2" />
            <span>{isSubmitting ? "Submitting Listing..." : "Publish New Equipment"}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
