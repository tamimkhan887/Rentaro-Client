"use client"

import * as React from "react"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { updateUser } from "@/lib/api/user"
import {
  ShieldCheck,
  Mail,
  User,
  KeyRound,
  Camera,
  Save,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Lock,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

export default function AdminMyProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  // Form states
  const [name, setName] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [previewError, setPreviewError] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Populate form with existing user data
  React.useEffect(() => {
    if (user) {
      setName(user.name || "")
      setImageUrl(user.image || "")
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    setPreviewError(false)
  }

  // Handle Form Submission with working functionality
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.add({
        title: "Name Required",
        description: "Please enter your administrator display name.",
        type: "error",
      })
      return
    }

    setIsUpdating(true)
    try {
      // 1. Update session via Better Auth client
      const authRes = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl.trim() || undefined,
      })

      if (authRes?.error) {
        throw new Error(authRes.error.message || "Failed to update profile")
      }

      // 2. Sync to MongoDB backend database if user ID is present
      const userId = user?.id || (user as { _id?: string })?._id
      if (userId) {
        await updateUser(userId, {
          name: name.trim(),
          image: imageUrl.trim() || undefined,
        })
      }

      toast.add({
        title: "Administrator Profile Updated",
        description: "Your administrator name and profile photo have been updated.",
        type: "success",
      })
    } catch (err: unknown) {
      console.error("Profile update error:", err)
      toast.add({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Could not update your profile.",
        type: "error",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Reset form to active session values
  const handleReset = () => {
    if (user) {
      setName(user.name || "")
      setImageUrl(user.image || "")
      setPreviewError(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Administrator Profile
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Super Administrator
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Manage your platform administrator credentials, identity details, and avatar image.
        </p>
      </div>

      {/* Admin Overview Card */}
      <Card className="border-border/70 bg-card shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative size-16 sm:size-20 shrink-0 rounded-2xl overflow-hidden bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-2xl shadow-xs">
                {imageUrl && !previewError ? (
                  <Image
                    src={imageUrl}
                    alt={name || "Admin avatar"}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : "A"}</span>
                )}
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {name || user?.name || "Administrator"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user?.email || "admin@rentora.com"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <ShieldCheck className="size-3" />
                    <span>Full Platform Access</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-3" />
                    <span>Active Session</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:self-center">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-xl border border-border/50">
                <Lock className="size-3.5 text-rose-600" />
                <span>Level 1 Root Privileges</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card className="border-border/70 bg-card shadow-xs">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="size-5 text-primary" />
            <span>Update Administrator Details</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Update your public display name and avatar image shown in the admin dashboard.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* 1. Profile Image Section */}
            <div className="space-y-3">
              <Label htmlFor="adminProfileImage" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Camera className="size-4 text-rose-600" />
                <span>Profile Image URL</span>
              </Label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Live thumbnail preview */}
                <div className="relative size-14 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/70 flex items-center justify-center text-muted-foreground">
                  {imageUrl && !previewError ? (
                    <Image
                      src={imageUrl}
                      alt="Thumbnail preview"
                      fill
                      sizes="56px"
                      className="object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <ImageIcon className="size-6 stroke-[1.5]" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <Input
                    id="adminProfileImage"
                    type="url"
                    placeholder="https://images.unsplash.com/... or direct image link"
                    value={imageUrl}
                    onChange={handleImageChange}
                    className="text-xs sm:text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Paste a direct HTTPS image URL (JPG, PNG, WebP) to update your administrator avatar.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 2. Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="adminFullName" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  <span>Administrator Display Name</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="adminFullName"
                  type="text"
                  placeholder="e.g. Alex Administrator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-xs sm:text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your name displayed on platform audit logs and approvals.
                </p>
              </div>

              {/* 3. Email Field (Read-only for security) */}
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span>Administrator Email Address</span>
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="text-xs sm:text-sm bg-muted/50 cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground">
                  Protected system email address.
                </p>
              </div>
            </div>
          </CardContent>

          {/* Form Actions */}
          <CardFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Administrator changes take effect immediately across all sessions.
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isUpdating}
                className="w-full sm:w-auto text-xs gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
                className="w-full sm:w-auto text-xs gap-1.5 font-semibold"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
