import { Banner } from "@/components/banner"
import { FeaturedEquipment } from "@/components/featured-equipment"
import { CategoriesSection } from "@/components/categories-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { TrustedOwnersSection } from "@/components/trusted-owners-section"
import { CustomerReviewsSection } from "@/components/customer-reviews-section"
import { getAllEquipments } from "@/lib/api/getAllEquipments"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch 6 approved equipment items using backend MongoDB limit aggregation
  const initialEquipments = await getAllEquipments({ status: "Approved", limit: 6 })

  return (
    <main className="min-h-screen bg-background">
      <Banner />
      <FeaturedEquipment initialEquipments={initialEquipments} />
      <CategoriesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <TrustedOwnersSection />
      <CustomerReviewsSection />
    </main>
  )
}
