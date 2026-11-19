import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitFork, Home } from "lucide-react"

function RoboticArmIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Heavy Machinery / Robotic Crane Arm */}
      <path d="M3 21h18" />
      <path d="M5 21v-3a2 2 0 0 1 2-2h3" />
      <circle cx="10" cy="16" r="1.5" />
      <path d="m10 14.5 4.5-6.5" />
      <circle cx="15.5" cy="7" r="1.5" />
      <path d="m16.5 7.5 3 3" />
      <path d="m19 11.5 2-1" />
      <path d="m20.5 13.5-2.5-1.5" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-[90vh] flex flex-col bg-[#FDFBF9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">

      {/* Main 404 Canvas */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Subtle Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]"
          aria-hidden="true"
        />

        {/* Ambient Warm & Cool Gradient Glows */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-linear-to-br from-[#e77952]/15 to-amber-200/20 blur-3xl dark:from-[#e77952]/10 dark:to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-stone-300/20 blur-3xl dark:bg-neutral-800/30"
          aria-hidden="true"
        />

        {/* Concentric Radar / Blueprint Target Overlay (Right side of canvas) */}
        <div
          className="pointer-events-none absolute right-[5%] top-[12%] hidden lg:block select-none opacity-30 dark:opacity-15"
          aria-hidden="true"
        >
          <svg width="460" height="460" viewBox="0 0 460 460" fill="none">
            <circle
              cx="230"
              cy="230"
              r="220"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5 5"
              className="text-stone-400 dark:text-stone-600"
            />
            <circle
              cx="230"
              cy="230"
              r="150"
              stroke="currentColor"
              strokeWidth="1"
              className="text-stone-300 dark:text-stone-700"
            />
            <circle
              cx="230"
              cy="230"
              r="80"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-stone-300 dark:text-stone-700"
            />
            <line
              x1="230"
              y1="0"
              x2="230"
              y2="460"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="text-stone-300 dark:text-stone-700"
            />
            <line
              x1="0"
              y1="230"
              x2="460"
              y2="230"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="text-stone-300 dark:text-stone-700"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Top Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-[#f4ebe6]/90 px-4 py-1.5 text-xs sm:text-[13px] font-medium text-stone-700 shadow-2xs backdrop-blur-xs transition-colors dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-300">
            <GitFork className="size-3.5 text-[#e77952] shrink-0" />
            <span>Network Fault Isolation: Node Unreachable</span>
          </div>

          {/* Large Styled "404" Number */}
          <div
            className="flex items-center justify-center font-extrabold tracking-tight select-none leading-none my-1 sm:my-2"
            aria-label="Error 404"
          >
            {/* Left 4 - Terracotta */}
            <span className="text-[110px] sm:text-[150px] md:text-[175px] font-bold text-[#c96645] drop-shadow-[0_12px_14px_rgba(40,20,10,0.18)] dark:drop-shadow-[0_12px_24px_rgba(201,102,69,0.35)]">
              4
            </span>
            {/* Middle 0 - Warm Peach / Coral */}
            <span className="text-[110px] sm:text-[150px] md:text-[175px] font-bold text-[#e27a57] drop-shadow-[0_12px_14px_rgba(40,20,10,0.18)] dark:drop-shadow-[0_12px_24px_rgba(226,122,87,0.35)] -mx-1 sm:-mx-2">
              0
            </span>
            {/* Right 4 - Taupe Terracotta */}
            <span className="text-[110px] sm:text-[150px] md:text-[175px] font-bold text-[#9e6b5c] drop-shadow-[0_12px_14px_rgba(40,20,10,0.18)] dark:drop-shadow-[0_12px_24px_rgba(158,107,92,0.35)]">
              4
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mt-2">
            Page Not Found
          </h1>

          {/* Descriptive Text */}
          <p className="mt-4 max-w-xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            The equipment listing, contract reference, or logistics depot route you are
            looking for has been relocated, decommissioned, or does not exist on the
            Rentora network.
          </p>

          {/* Action Buttons Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
            {/* Button 1: Return to Home (Orange filled) */}
            <Link href="/" className="group focus:outline-hidden">
              <Button
                variant="brand"
                className="h-13 px-5 py-2 rounded-xl bg-[#e77952] hover:bg-[#d86b44] active:bg-[#c95f38] text-white shadow-sm hover:shadow-md transition-all gap-3 cursor-pointer"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-white/15 group-hover:bg-white/20 transition-colors">
                  <Home className="size-4.5 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-white/90">
                    Return to
                  </span>
                  <span className="block text-sm font-bold text-white">Home</span>
                </div>
              </Button>
            </Link>

            {/* Button 2: Explore All Equipment (White / Subtle card) */}
            <Link href="/equipments" className="group focus:outline-hidden">
              <Button
                variant="outline"
                className="h-13 px-5 py-2 rounded-xl bg-white hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800/80 dark:border-neutral-800 border-neutral-200/90 text-neutral-800 dark:text-neutral-100 shadow-2xs hover:shadow-xs transition-all gap-3 cursor-pointer"
              >
                <div className="flex size-7 items-center justify-center text-neutral-700 dark:text-neutral-300">
                  <RoboticArmIcon className="size-5.5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Explore All
                  </span>
                  <span className="block text-sm font-bold text-neutral-900 dark:text-white">
                    Equipment
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
