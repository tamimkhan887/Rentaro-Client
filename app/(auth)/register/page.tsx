"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Link as LinkIcon,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
    Check,
    Copy,
    UserCheck,
    HardHat,
    ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

type UserRole = "customer" | "owner" | "admin"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        photoUrl: "",
        role: "customer" as UserRole,
        password: "",
        confirmPassword: "",
    })

    const [photoPreview, setPhotoPreview] = React.useState<string>("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [copiedPassword, setCopiedPassword] = React.useState(false)

    // Allow copying password even when hidden (type="password")
    const copyPasswordToClipboard = () => {
        if (!formData.password) return
        navigator.clipboard.writeText(formData.password)
        setCopiedPassword(true)
        setTimeout(() => setCopiedPassword(false), 2000)
    }

    const handlePasswordCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const start = target.selectionStart ?? 0
        const end = target.selectionEnd ?? target.value.length
        const textToCopy =
            start !== end ? target.value.slice(start, end) : target.value

        if (textToCopy) {
            e.clipboardData.setData("text/plain", textToCopy)
            e.preventDefault()
        }
    }

    const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
            const target = e.currentTarget
            const start = target.selectionStart ?? 0
            const end = target.selectionEnd ?? target.value.length
            const selected =
                start !== end ? target.value.slice(start, end) : target.value
            if (selected && typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(selected)
            }
        }
    }

    // 1. Password complexity rules:
    // - Minimum length of 6 characters
    // - At least one uppercase letter (A-Z)
    // - At least one lowercase letter (a-z)
    const hasMinLength = formData.password.length >= 8
    const hasUppercase = /[A-Z]/.test(formData.password)
    const hasLowercase = /[a-z]/.test(formData.password)
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase

    // 2. Confirm password matching:
    const hasConfirmPassword = formData.confirmPassword.length > 0
    const isPasswordMatch =
        hasConfirmPassword && formData.password === formData.confirmPassword
    const isPasswordMismatch =
        hasConfirmPassword && formData.password !== formData.confirmPassword

    // 3. Overall form validation
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        isPasswordValid &&
        isPasswordMatch

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (name === "photoUrl") {
            setPhotoPreview(value)
        }
    }

    const handleRoleSelect = (role: UserRole) => {
        setFormData((prev) => ({ ...prev, role }))
    }

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.add({
                title: "Name is required",
                description: "Please enter your full name.",
                type: "error",
            })
            return
        }

        if (!formData.email.trim()) {
            toast.add({
                title: "Email is required",
                description: "Please enter a valid email address.",
                type: "error",
            })
            return
        }

        if (!isPasswordValid) {
            toast.add({
                title: "Weak Password",
                description: "Password must be at least 8 characters with at least one uppercase and one lowercase letter.",
                type: "error",
            })
            return
        }

        if (isPasswordMismatch) {
            toast.add({
                title: "Passwords do not match",
                description: "Please make sure your confirmation password matches.",
                type: "error",
            })
            return
        }

        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            const { data, error } = await authClient.signUp.email({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                image: formData.photoUrl || undefined,
                role: formData.role,
            })

            if (data?.user) {
                setFormData({
                    name: "",
                    email: "",
                    photoUrl: "",
                    role: "customer",
                    password: "",
                    confirmPassword: "",
                })
                toast.add({
                    title: "Registration Successful",
                    description: "Your account has been created! Welcome to Rentora.",
                    type: "success",
                })
                router.push("/")
                router.refresh()
            }
            if (error) {
                toast.add({
                    title: "Registration Failed",
                    description: error.message || "Failed to create account",
                    type: "error",
                })
            }
        } catch (err: unknown) {
            toast.add({
                title: "Registration Error",
                description: err instanceof Error ? err.message : "Something went wrong during registration",
                type: "error",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        try {
            const res = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            })
            if (res?.error) {
                toast.add({
                    title: "Google Sign-Up Failed",
                    description: res.error.message || "Failed to sign up with Google",
                    type: "error",
                })
                setIsGoogleLoading(false)
            } else if (res?.data?.url) {
                window.location.href = res.data.url
            }
        } catch (err: unknown) {
            toast.add({
                title: "Google Sign-Up Failed",
                description: err instanceof Error ? err.message : "Could not sign in with Google",
                type: "error",
            })
            setIsGoogleLoading(false)
        }
    }

    const roles: {
        value: UserRole
        title: string
        desc: string
        icon: React.ElementType
    }[] = [
            {
                value: "customer",
                title: "Customer",
                desc: "Rent equipment",
                icon: UserCheck,
            },
            {
                value: "owner",
                title: "Owner",
                desc: "List machinery",
                icon: HardHat,
            },
            {
                value: "admin",
                title: "Admin",
                desc: "Operations",
                icon: ShieldCheck,
            },
        ]

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
            {/* Main Registration Container */}
            <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">
                {/* Ambient Decorative Background */}
                <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[36px_36px]   mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-linear-to-br from-[#e77952]/15 to-amber-200/20 blur-3xl dark:from-[#e77952]/10 dark:to-transparent"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-stone-300/20 blur-3xl dark:bg-neutral-800/30"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-lg">
                    {/* Header Badge */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e77952]/30 bg-[#e77952]/10 px-3.5 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/40 dark:bg-[#e77952]/15">
                            <Sparkles className="size-3.5" />
                            <span>Rentora Fleet Access</span>
                        </div>
                        <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Create Your Account
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Join Rentora to rent industrial equipment or list your machinery.
                        </p>
                    </div>

                    {/* Registration Card */}
                    <Card className="border border-neutral-200/90 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-xl backdrop-blur-md rounded-2xl overflow-hidden">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Account Details
                            </CardTitle>
                            <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                                Enter your details and select your account role to register
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 1. Full Name Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Full Name <span className="text-[#e77952]">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="e.g. Alex Morgan"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="pl-9.5 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                        />
                                    </div>
                                </div>

                                {/* 2. Email Address Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Email Address <span className="text-[#e77952]">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="pl-9.5 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                        />
                                    </div>
                                </div>

                                {/* 3. Role-Based Selection (Customer, Owner, Admin) */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        Account Role <span className="text-[#e77952]">*</span>
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {roles.map((r) => {
                                            const isSelected = formData.role === r.value
                                            const Icon = r.icon
                                            return (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(r.value)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer relative",
                                                        isSelected
                                                            ? "border-[#e77952] bg-[#e77952]/10 dark:bg-[#e77952]/15 text-[#e77952] shadow-2xs ring-1 ring-[#e77952]"
                                                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/50"
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            "size-5 mb-1",
                                                            isSelected
                                                                ? "text-[#e77952]"
                                                                : "text-neutral-500 dark:text-neutral-400"
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "text-xs font-semibold",
                                                            isSelected
                                                                ? "text-neutral-900 dark:text-white"
                                                                : "text-neutral-700 dark:text-neutral-300"
                                                        )}
                                                    >
                                                        {r.title}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                                        {r.desc}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* 4. Profile Photo (Direct Image Link & Live Preview Only) */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="photoUrl"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Profile Photo{" "}
                                        <span className="text-xs text-neutral-400 font-normal">
                                            (Direct image URL)
                                        </span>
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        {/* Live Avatar Preview */}
                                        <div className="relative flex size-12 sm:size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-2xs">
                                            {photoPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={photoPreview}
                                                    alt="Profile Preview"
                                                    className="size-full object-cover"
                                                    onError={() => setPhotoPreview("")}
                                                />
                                            ) : (
                                                <ImageIcon className="size-5 sm:size-6 text-neutral-400" />
                                            )}
                                        </div>

                                        <div className="relative flex-1">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                            <Input
                                                id="photoUrl"
                                                name="photoUrl"
                                                type="url"
                                                placeholder="https://example.com/avatar.jpg"
                                                value={formData.photoUrl}
                                                onChange={handleInputChange}
                                                className="pl-9.5 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Password Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Password <span className="text-[#e77952]">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="Enter a strong password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onCopy={handlePasswordCopy}
                                            onKeyDown={handlePasswordKeyDown}
                                            className="pl-9.5 pr-18 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {formData.password && (
                                                <button
                                                    type="button"
                                                    onClick={copyPasswordToClipboard}
                                                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden transition-colors"
                                                    title={copiedPassword ? "Copied to clipboard!" : "Copy password"}
                                                    aria-label="Copy password"
                                                >
                                                    {copiedPassword ? (
                                                        <Check className="size-4 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="size-4" />
                                                    )}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden transition-colors"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Real-time Password Validation Requirements */}
                                    <div className="mt-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-black p-4 space-y-1.5">
                                        <div className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                                            Password Requirements:
                                        </div>
                                        <ul className="space-y-1 text-xs">
                                            {/* At least 8 characters */}
                                            <li
                                                className={`flex items-center gap-1.5 transition-colors ${hasMinLength
                                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                                    : "text-neutral-500 dark:text-neutral-400"
                                                    }`}
                                            >
                                                {hasMinLength ? (
                                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="size-3.5 text-red-600  shrink-0" />
                                                )}
                                                <span>At least 8 characters in length</span>
                                            </li>

                                            {/* Must have an uppercase letter */}
                                            <li
                                                className={`flex items-center gap-1.5 transition-colors ${hasUppercase
                                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                                    : "text-neutral-500 dark:text-neutral-400"
                                                    }`}
                                            >
                                                {hasUppercase ? (
                                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="size-3.5 text-red-600 shrink-0" />
                                                )}
                                                <span>Must contain at least one uppercase letter (A-Z)</span>
                                            </li>

                                            {/* Must have a lowercase letter */}
                                            <li
                                                className={`flex items-center gap-1.5 transition-colors ${hasLowercase
                                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                                    : "text-neutral-500 dark:text-neutral-400"
                                                    }`}
                                            >
                                                {hasLowercase ? (
                                                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="size-3.5 text-red-600 shrink-0" />
                                                )}
                                                <span>Must contain at least one lowercase letter (a-z)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 6. Confirm Password Field */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="confirmPassword"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Confirm Password <span className="text-[#e77952]">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="Re-enter your password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            onCopy={handlePasswordCopy}
                                            onKeyDown={handlePasswordKeyDown}
                                            className={cn(
                                                "pl-9.5 pr-10 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:ring-[#e77952]/20",
                                                isPasswordMismatch &&
                                                "border-rose-500 focus-visible:border-rose-500 text-rose-600 dark:text-rose-400",
                                                isPasswordMatch &&
                                                "border-emerald-500 focus-visible:border-emerald-500"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-hidden"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Real-time Match Validation Feedback */}
                                    {hasConfirmPassword && (
                                        <div className="flex items-center gap-1.5 text-xs pt-0.5">
                                            {isPasswordMatch ? (
                                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    <CheckCircle2 className="size-3.5 shrink-0" />
                                                    <span>Passwords match</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                                                    <XCircle className="size-3.5 shrink-0" />
                                                    <span>Passwords do not match</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="lg"
                                    disabled={!isFormValid || isSubmitting}
                                    className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isSubmitting ? "Creating Account..." : "Register Account"}</span>
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>

                                {/* Divider */}
                                <div className="relative flex items-center py-2">
                                    <div className="grow border-t border-neutral-200 dark:border-neutral-700" />
                                    <span className="mx-4 text-xs text-neutral-400 whitespace-nowrap">
                                        OR CONTINUE WITH
                                    </span>
                                    <div className="grow border-t border-neutral-200 dark:border-neutral-700" />
                                </div>

                                {/* Google Sign-Up */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    disabled={isSubmitting || isGoogleLoading}
                                    className="w-full h-11 rounded-xl text-sm font-semibold border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer disabled:opacity-60"
                                >
                                    <svg
                                        className="mr-2 size-4"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.04 13.22l7.98 6.19C12.9 13.72 18.02 9.5 24 9.5z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.65 5.94c4.47-4.13 7.13-10.21 7.13-17.59z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M11.02 28.59A14.4 14.4 0 0 1 10.25 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 3.04 10.78l7.98-6.19z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.47 0 11.9-2.13 15.85-5.86l-7.65-5.94c-2.13 1.43-4.89 2.28-8.2 2.28-5.98 0-11.1-4.22-12.98-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"
                                        />
                                    </svg>
                                    {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
                                </Button>
                            </form>
                        </CardContent>

                        {/* Bottom Link to Login Page */}
                        <CardFooter className="flex items-center justify-center border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 py-4">
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-[#e77952] hover:text-[#d86b44] hover:underline transition-colors"
                                >
                                    Log In
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
