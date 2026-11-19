"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export interface NavLinkItem {
  label: string
  href: string
  isActive?: boolean
}

interface NavbarProps {
  navLinks?: NavLinkItem[]
  className?: string
}

const defaultNavLinks: NavLinkItem[] = [
  { label: "Home", href: "/", isActive: true },
  { label: "All Equipment", href: "/equipment" },
  { label: "Contact Us", href: "/contact" },
]

export function Navbar({
  navLinks = defaultNavLinks,
  className,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/95 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/95",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            aria-label="Rentora Home"
          >
            {/* Light Mode Logo */}
            <Image
              src="/Logo.png"
              alt="Rentora Logo"
              width={145}
              height={48}
              className="h-14 md:h-14 w-auto object-contain dark:hidden"
              priority
            />
            {/* Dark Mode Logo with high-contrast text */}
            <Image
              src="/Logo-dark.png"
              alt="Rentora Logo"
              width={145}
              height={48}
              className="h-14 md:h-14 w-auto object-contain hidden dark:block"
              priority
            />
          </Link>
        </div>
        <div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#e77952] dark:hover:text-[#e77952]",
                  link.isActive
                    ? "text-neutral-900 font-semibold dark:text-neutral-100"
                    : "text-neutral-600 dark:text-neutral-300"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Log In Button (Shadcn Button variant="ghost") */}
          <Link href="/login">
            <Button
              variant="ghost"
              size="lg"
              className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:text-white dark:hover:bg-neutral-800 font-medium text-sm px-4 h-9.5 rounded-lg"
            >
              Log In
            </Button>
          </Link>

          {/* Register Button (Shadcn Button variant="brand") */}
          <Link href="/register">
            <Button
              variant="brand"
              size="lg"
              className="rounded-lg px-5 h-9.5 text-sm font-medium shadow-sm hover:shadow active:scale-95 transition-all"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Controls (Theme Toggle + Hamburger Menu) */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="size-9 rounded-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200/80 bg-white/95 px-4 pt-3 pb-6 shadow-lg backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/95 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-base font-medium transition-colors",
                  link.isActive
                    ? "bg-neutral-100 text-neutral-900 font-semibold dark:bg-neutral-900 dark:text-white"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-[#e77952] dark:text-neutral-300 dark:hover:bg-neutral-900/60 dark:hover:text-[#e77952]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2.5 border-t border-neutral-200/70 pt-4 dark:border-neutral-800/70">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center text-neutral-800 dark:text-neutral-200 h-10"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full justify-center h-10 shadow-sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
