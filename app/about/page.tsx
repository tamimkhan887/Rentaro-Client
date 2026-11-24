"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ShieldCheck,
  BadgeDollarSign,
  Clock,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  HardHat,
  Camera,
  Tractor,
  Music,
  Cpu,
  Car,
  ChevronDown,
  Quote,
  Users,
  Target,
  Globe2,
  Award,
  Zap,
  Leaf,
  Layers,
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

// Value pillars
const coreValues = [
  {
    icon: BadgeDollarSign,
    title: "Fair & Transparent Pricing",
    tagline: "No hidden fees, ever",
    description:
      "We believe heavy machinery and specialized production equipment should have crystal-clear daily, weekly, and monthly rates with zero surprise fuel or return fees.",
  },
  {
    icon: ShieldCheck,
    title: "Rigorous Safety & Verification",
    tagline: "Certified equipment & vetted owners",
    description:
      "Every piece of equipment is verified with maintenance logs, operational checks, and owner identity vetting to ensure maximum safety on your job site.",
  },
  {
    icon: Zap,
    title: "Rapid Dispatch & Convenience",
    tagline: "From reservation to operation",
    description:
      "Book machinery in seconds with digital rental agreements, flexible pickup depots, and reliable door-to-site delivery options tailored to your project schedule.",
  },
  {
    icon: HeartHandshake,
    title: "Empowering Local Owners",
    tagline: "Unlocking idle fleet potential",
    description:
      "We help local contractors, event production companies, and farmers turn idle equipment into sustainable revenue streams while supporting their communities.",
  },
  {
    icon: Leaf,
    title: "Circular & Sustainable Economy",
    tagline: "Shared resources for a greener future",
    description:
      "By sharing existing machinery and tools, we reduce duplicate manufacturing demand, cut waste, and foster an eco-friendly circular industrial ecosystem.",
  },
  {
    icon: Users,
    title: "Dedicated Human Support",
    tagline: "Real equipment specialists",
    description:
      "Our logistics and equipment specialists are available to answer questions, guide machinery selection, and resolve unexpected project emergencies.",
  },
]

// Milestones
const milestones = [
  {
    year: "2024",
    title: "The Spark of an Idea",
    description:
      "Founded by frustrated contractors and filmmakers who realized that quality machinery was sitting idle in garages and yards while neighboring teams struggled with expensive broker rates.",
  },
  {
    year: "2025",
    title: "Expansion to 6 Industries",
    description:
      "Expanded from basic construction equipment to photography gear, agricultural machinery, transport vehicles, electronics, and event audio-visual systems.",
  },
  {
    year: "2026",
    title: "Nationwide Rental Community",
    description:
      "Empowered over 1,500 equipment owners and served thousands of contractors, creators, and businesses with instant digital bookings and escrow protection.",
  },
]

// Audiences / Categories We Serve
const personas = [
  {
    icon: HardHat,
    category: "Construction & Contractors",
    title: "Heavy Machinery Without The Debt",
    description:
      "Excavators, scissor lifts, concrete mixers, and generators on flexible terms so you can bid on bigger jobs without buying depreciating assets.",
    badge: "Most Popular",
  },
  {
    icon: Camera,
    category: "Filmmakers & Photographers",
    title: "Cinema Glass & Pro Kits",
    description:
      "Rent RED & ARRI cameras, anamorphic lenses, high-payload gimbals, and lighting rigs for commercial shoots, indie films, and weddings.",
    badge: "Creative Fleet",
  },
  {
    icon: Tractor,
    category: "Agriculture & Landscaping",
    title: "Seasonal Farming Power",
    description:
      "Access tractors, rotary tillers, seeders, and balers during peak harvest seasons without year-round storage and maintenance overhead.",
    badge: "Seasonal",
  },
  {
    icon: Music,
    category: "Live Events & Production",
    title: "Concert Sound & Stage Rigging",
    description:
      "Tour-grade line array speakers, wireless mics, moving head lights, and power distros ready for festivals, corporate summits, and concerts.",
    badge: "Live AV",
  },
]

// Leadership team
const teamMembers = [
  {
    name: "Alex Rivera",
    role: "Co-Founder & CEO",
    bio: "Former commercial site superintendent who spent 10 years dealing with broken rental broker systems before building Rentora.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote: "Equipment should move projects forward, not bankrupt them.",
  },
  {
    name: "Marcus Vance",
    role: "VP of Machinery & Safety",
    bio: "Certified heavy machinery inspector with 15+ years overseeing OSHA compliance and industrial fleet reliability.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "Safety is non-negotiable. Every listed machine meets strict standards.",
  },
  {
    name: "Maya Lin",
    role: "Head of Product & Experience",
    bio: "Ex-logistics engineer passionate about turning complex rental contracts into one-click digital bookings.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    quote: "We make renting a 20-ton excavator as easy as ordering a rideshare.",
  },
  {
    name: "Sophia Chen",
    role: "Head of Owner Success",
    bio: "Dedicated advocate who helps local equipment owners market their machinery and maximize utilization safely.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    quote: "When local equipment owners thrive, our entire economy benefits.",
  },
]

// FAQs
const faqs = [
  {
    question: "How does Rentora verify the condition of equipment?",
    answer:
      "Every piece of equipment listed on Rentora requires high-resolution photos, detailed serial/model specifications, and operational maintenance disclosures. For heavy machinery and high-value gear, our certified inspection partners perform periodic verification.",
  },
  {
    question: "What happens if equipment breaks down during a rental?",
    answer:
      "Rentora includes basic operational guarantees. If equipment suffers a verified mechanical breakdown through no fault of the renter, our team assists in arranging an immediate replacement or issuing a prompt refund for unused rental days.",
  },
  {
    question: "Can I list my own equipment on Rentora?",
    answer:
      "Yes! Any verified business or private owner can list machinery, vehicles, audio-visual equipment, or tools. You set your own daily, weekly, and monthly rates, availability schedule, and rental requirements.",
  },
  {
    question: "How are rental payments and security deposits protected?",
    answer:
      "We use encrypted escrow processing. Payments and security deposits are securely held until the rental period begins and condition inspections are confirmed, protecting both the renter and the owner.",
  },
]

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/60">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Story & Mission</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              Democratizing Access to Heavy Machinery, Tools & Gear
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Rentora was born from a frustrating reality: buying specialized equipment costs tens of thousands of dollars, yet traditional rental brokers charge excessive fees and make paperwork painful. We built a transparent, community-powered rental platform where builders, creators, and businesses access the exact tools they need — when they need them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <Link href="/equipment">
                <Button size="lg" className="gap-2 font-semibold shadow-sm">
                  <span>Browse Equipment Fleet</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/owner/add-equipment">
                <Button variant="outline" size="lg" className="gap-2 font-semibold">
                  <HardHat className="h-4 w-4" />
                  <span>List Your Equipment</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Quick Stats Grid using shadcn Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-16">
            <Card className="text-center p-6 border-border/70 hover:border-primary/40 transition-colors">
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
                1,500+
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground">
                Verified Equipment Items
              </CardDescription>
              <p className="text-[11px] text-muted-foreground mt-1">Across 6 major industries</p>
            </Card>

            <Card className="text-center p-6 border-border/70 hover:border-primary/40 transition-colors">
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
                99.4%
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground">
                On-Time Delivery Rate
              </CardDescription>
              <p className="text-[11px] text-muted-foreground mt-1">Reliable on-site dispatch</p>
            </Card>

            <Card className="text-center p-6 border-border/70 hover:border-primary/40 transition-colors">
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
                $4.5M+
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground">
                Saved By Renters
              </CardDescription>
              <p className="text-[11px] text-muted-foreground mt-1">Compared to buying new assets</p>
            </Card>

            <Card className="text-center p-6 border-border/70 hover:border-primary/40 transition-colors">
              <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
                4.9 / 5
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium text-foreground">
                Customer Satisfaction
              </CardDescription>
              <p className="text-[11px] text-muted-foreground mt-1">From over 5,000+ reviews</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. THE STORY / PROBLEM & SOLUTION */}
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden border border-border/80 shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
                  alt="Industrial machinery working on site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 max-w-xs p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xl backdrop-blur-md">
                <Quote className="h-6 w-6 text-primary mb-2 opacity-80" />
                <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                  &ldquo;Why should a small contractor take a \$60,000 loan for a machine they only need for three weeks?&rdquo;
                </p>
                <span className="text-[11px] text-muted-foreground block mt-2 font-semibold">
                  — The Rentora Founding Question
                </span>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Target className="h-4 w-4" />
                <span>The Rentora Difference</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Built by people who have stood on muddy job sites and creative sets.
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                If you have ever tried renting heavy equipment from legacy yards, you know the drill: call three sales desks, wait 48 hours for an email quote, decipher ambiguous insurance surcharges, and hope the machine arrives in working condition.
              </p>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Meanwhile, thousands of verified contractors, farmers, and production houses have certified gear sitting idle between contracts. Rentora bridges this gap with technology, instant transparency, and verified trust.
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Zero Broker Markups</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Direct transparent rates set by verified owners with competitive price guarantees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Instant Digital Booking</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No endless phone tags or paper forms. Select your dates, calculate totals, and reserve.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Verified Pre-Rent Inspections</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Know exactly what condition equipment is in before it arrives on your site.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Flexible Rental Durations</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Daily, weekly, or monthly periods with automatic duration discounts.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES GRID */}
      <section className="py-16 sm:py-24 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              What Drives Us
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Our Core Commitments
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              These fundamental principles guide every feature we build, every owner we vet, and every rental agreement we facilitate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card
                  key={idx}
                  className="border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-primary block">
                        {value.tagline}
                      </span>
                      <CardTitle className="text-lg font-bold text-foreground mt-1">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. WHO WE SERVE */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Versatile Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Tailored Solutions For Every Industry
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              From heavy dirt work to high-fashion commercial photography, Rentora powers specialized workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personas.map((persona, index) => {
              const Icon = persona.icon
              return (
                <Card
                  key={index}
                  className="border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border/60">
                        {persona.badge}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-primary block">
                        {persona.category}
                      </span>
                      <CardTitle className="text-base font-bold text-foreground mt-1">
                        {persona.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {persona.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/60">
                    <Link
                      href={`/equipment?category=${encodeURIComponent(persona.category.split(" ")[0])}`}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore {persona.category.split(" ")[0]} gear</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. TIMELINE / OUR JOURNEY */}
      <section className="py-16 sm:py-24 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              From Job Site Frustration to Nationwide Fleet
            </h2>
            <p className="text-sm text-muted-foreground">
              A rapid timeline of how we reimagined the industrial equipment rental experience.
            </p>
          </div>

          <div className="relative border-l-2 border-primary/20 ml-4 sm:ml-32 space-y-10 py-2">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8">
                {/* Year Marker on the left */}
                <div className="hidden sm:block absolute -left-28 top-0 text-right w-20 font-extrabold text-xl text-primary">
                  {milestone.year}
                </div>

                {/* Dot */}
                <div className="absolute -left-2.25 top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />

                <div className="sm:hidden text-xs font-bold text-primary uppercase mb-1">
                  {milestone.year}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEET THE TEAM */}
      <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              The Humans Behind Rentora
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Passionate Operators & Technologists
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              We bring decades of combined experience across civil engineering, equipment safety, film production, and modern web infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="space-y-1 pt-4">
                    <CardTitle className="text-base font-bold text-foreground">
                      {member.name}
                    </CardTitle>
                    <span className="text-xs font-medium text-primary block">
                      {member.role}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="pt-2 border-t border-border/60">
                  <p className="text-[11px] italic text-muted-foreground">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-24 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about renting gear or becoming an equipment partner.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <Card
                  key={index}
                  className="border-border/70 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground cursor-pointer hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="pt-0 pb-5 px-4 sm:px-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          {faq.answer}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Card className="relative overflow-hidden border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground mx-auto">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready to Power Your Next Project?</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Join Thousands of Renters and Equipment Owners Today
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Whether you need a mini-excavator for a weekend dig or want to generate passive income from your idle sound system, Rentora is your trusted partner.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/equipment">
                <Button size="lg" className="gap-2 font-semibold shadow-sm">
                  <span>Explore All Equipment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/owner/add-equipment">
                <Button variant="outline" size="lg" className="gap-2 font-semibold">
                  <HardHat className="h-4 w-4" />
                  <span>List Equipment As Owner</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
