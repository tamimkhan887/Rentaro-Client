
"use client"

import * as React from "react"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import {
  User,
  Mail,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Save,
  RotateCcw,
  Image as ImageIcon,
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

export default function CustomerProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [previewUrl, setPreviewUrl] = React.useState("")
  const [previewError, setPreviewError] = React.useState(false)

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updateUser = Object.fromEntries(formData.entries())
    const {data,error} = await authClient.updateUser({
      ...updateUser
    })
    if(data){
      toast.add({
        title:"Profile updated successfully",
      })
    }
    if(error){
      toast.add({
        title:"Profile update failed",
        description:error.message,
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()

    setPreviewError(false)

    // Only preview complete URLs
    try {
      const url = new URL(value)

      if (url.protocol === "https:" || url.protocol === "http:") {
        setPreviewUrl(value)
      } else {
        setPreviewUrl("")
      }
    } catch {
      setPreviewUrl("")
    }
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form

    form?.reset()
    setPreviewUrl(user?.image || "")
    setPreviewError(false)
  }

  React.useEffect(() => {
    setPreviewUrl(user?.image || "")
  }, [user?.image])

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Customer Profile
          </h1>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Account Settings
          </span>
        </div>

        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          View and update your personal information, contact email, and profile avatar.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-border/70 bg-card shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              {/* Avatar Preview */}
              <div className="relative size-16 sm:size-20 shrink-0 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-xs">

                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile avatar"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span>
                    {user?.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                )}

              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {user?.name || "Customer Account"}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user?.email || "customer@rentora.com"}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-3" />
                    Verified Customer
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border/60">
                    <ShieldCheck className="size-3" />
                    Standard Access
                  </span>
                </div>
              </div>

            </div>

            <div className="sm:self-center">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-xl border border-border/50">
                <Sparkles className="size-3.5 text-primary" />
                Rentora Member
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
            Update Profile Details
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Modify your display name, registered email address, and profile photo.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>

          <CardContent className="p-6 space-y-6">

            {/* Profile Image */}
            <div className="space-y-3">

              <Label htmlFor="profileImage" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Camera className="size-4 text-primary" />
                Profile Image URL
              </Label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                {/* Image Preview */}
                <div className="relative size-14 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/70 flex items-center justify-center text-muted-foreground">

                  {previewUrl && !previewError ? (
                    <Image
                      src={previewUrl}
                      alt="Thumbnail preview"
                      fill
                      sizes="56px"
                      className="object-cover"
                      onError={() => setPreviewError(true)}
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="size-6 stroke-[1.5]" />
                  )}

                </div>

                <div className="flex-1 w-full space-y-1">

                  <Input
                    id="profileImage"
                    name="image"
                    type="url"
                    placeholder="https://example.com/image.png"
                    defaultValue={user?.image || ""}
                    onChange={handleImageChange}
                    className="text-xs sm:text-sm"
                  />

                  <p className="text-[11px] text-muted-foreground">
                    Paste a direct HTTPS link to an image (JPG, PNG, WebP) to display as your avatar.
                  </p>

                </div>

              </div>
            </div>

              {/* Full Name */}
              <div className="space-y-2">

                <Label htmlFor="fullName" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                  <User className="size-3.5 text-primary" />
                  Full Name
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="fullName"
                  name="name"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  defaultValue={user?.name || ""}
                  required
                  className="text-xs sm:text-sm"
                />

                <p className="text-[11px] text-muted-foreground">
                  Your full name will be shown on equipment booking requests.
                </p>

              </div>

          </CardContent>

          {/* Form Actions */}
          <CardFooter className="border-t border-border/60 bg-muted/20 px-6 py-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">

            <p className="text-[11px] text-muted-foreground">
              Make sure your details are accurate before submitting.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full sm:w-auto text-xs gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </Button>

              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto text-xs gap-1.5 font-semibold"
              >
                <Save className="size-3.5" />
                Save Changes
              </Button>

            </div>

          </CardFooter>

        </form>
      </Card>

    </div>
  )
}
