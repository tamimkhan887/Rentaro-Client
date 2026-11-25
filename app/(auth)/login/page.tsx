"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    Loader2,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"

export default function LoginPage() {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email || !password || isLoading) return

        setIsLoading(true)
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            })

            if (data?.user) {
                // Generate and store JWT access token upon successful login
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
                    const jwtRes = await fetch(`${backendUrl}/jwt`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: data.user.email,
                            name: data.user.name,
                            role: (data.user as any)?.role,
                            userId: data.user.id,
                        }),
                    })
                    const jwtData = await jwtRes.json()
                    if (jwtData?.token && typeof window !== "undefined") {
                        localStorage.setItem("access-token", jwtData.token)
                    }
                } catch (jwtErr) {
                    console.error("JWT token generation failed:", jwtErr)
                }

                toast.add({
                    title: "Login Successful",
                    description: "Welcome back to Rentora!",
                    type: "success",
                })
                const callbackUrl =
                    (typeof window !== "undefined"
                        ? new URLSearchParams(window.location.search).get("callbackUrl")
                        : null) || "/"
                router.push(callbackUrl)
                router.refresh()
            }

            if (error) {
                toast.add({
                    title: "Login Failed",
                    description: error.message || "Invalid credentials",
                    type: "error",
                })
            }
        } catch (err: unknown) {
            toast.add({
                title: "Error",
                description: err instanceof Error ? err.message : "Something went wrong",
                type: "error",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Google login via Better Auth
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        const callbackUrl =
            (typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("callbackUrl")
                : null) || "/"
        try {
            const res = await authClient.signIn.social({
                provider: "google",
                callbackURL: callbackUrl,
            })
            if (res?.error) {
                toast.add({
                    title: "Google Login Failed",
                    description: res.error.message || "Failed to sign in with Google",
                    type: "error",
                })
                setIsGoogleLoading(false)
            } else if (res?.data?.url) {
                window.location.href = res.data.url
            }
        } catch (err: unknown) {
            toast.add({
                title: "Google Login Failed",
                description: err instanceof Error ? err.message : "Could not sign in with Google",
                type: "error",
            })
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-[95vh] flex flex-col bg-[#FDFBF9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
            <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Grid */}
                <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]"
                    aria-hidden="true"
                />

                {/* Background Gradient */}
                <div
                    className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-linear-to-br from-[#e77952]/15 to-amber-200/20 blur-3xl dark:from-[#e77952]/10 dark:to-transparent"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-md">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e77952]/30 bg-[#e77952]/10 px-3.5 py-1 text-xs font-semibold text-[#e77952] dark:border-[#e77952]/40 dark:bg-[#e77952]/15">
                            <Sparkles className="size-3.5" />
                            <span>Welcome Back</span>
                        </div>

                        <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Log In to Rentora
                        </h1>

                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Access your rental orders, saved fleet, and equipment listings.
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="border border-neutral-200/90 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-xl backdrop-blur-md rounded-2xl overflow-hidden">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                                Sign In
                            </CardTitle>

                            <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                                Enter your email and password to continue
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="login-email"
                                        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Email Address
                                    </Label>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9.5 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="login-password"
                                            className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                        >
                                            Password
                                        </Label>

                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-[#e77952] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                        <Input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9.5 pr-10 h-10 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus-visible:border-[#e77952] focus-visible:ring-[#e77952]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-hidden"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="lg"
                                    disabled={isLoading || !email || !password}
                                    className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Log In</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </>
                                    )}
                                </Button>

                                {/* Divider */}
                                <div className="relative flex items-center py-2">
                                    <div className="grow border-t border-neutral-200 dark:border-neutral-700" />
                                    <span className="mx-4 text-xs text-neutral-400 whitespace-nowrap">
                                        OR CONTINUE WITH
                                    </span>
                                    <div className="grow border-t border-neutral-200 dark:border-neutral-700" />
                                </div>

                                {/* Google Login */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading || isGoogleLoading}
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

                        {/* Register Link */}
                        <CardFooter className="flex items-center justify-center border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 py-4">
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-[#e77952] hover:text-[#d86b44] hover:underline transition-colors"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}