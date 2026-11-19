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
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Backend login logic will be implemented here
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradients */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#e77952]/15 to-amber-200/20 blur-3xl dark:from-[#e77952]/10 dark:to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-md">
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
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
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

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Password
                    </Label>
                    <a href="#" className="text-xs text-[#e77952] hover:underline">
                      Forgot password?
                    </a>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-hidden"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  size="lg"
                  className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer"
                >
                  <span>Log In</span>
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </form>
            </CardContent>

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
