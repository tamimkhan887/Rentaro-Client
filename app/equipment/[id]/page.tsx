import { Metadata } from "next"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Search } from "lucide-react"

import { getSingleEquipment } from "@/lib/api/getSingleEquipment"
import { EquipmentDetailView } from "@/components/equipment-detail-view"
import { Button } from "@/components/ui/button"

type ViewDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ViewDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const equipment = await getSingleEquipment(id)

  if (!equipment) {
    return {
      title: "Equipment Not Found | Rentora",
      description: "The requested equipment item could not be found.",
    }
  }

  return {
    title: `${equipment.name} | Rentora Equipment Rental`,
    description: equipment.description || `Rent ${equipment.name} at affordable rates on Rentora.`,
    openGraph: {
      title: `${equipment.name} | Rentora`,
      description: equipment.description,
      images: equipment.imageUrl ? [equipment.imageUrl] : [],
    },
  }
}

export default async function ViewDetailsPage({
  params,
}: ViewDetailsPageProps) {
  const { id } = await params
  const equipment = await getSingleEquipment(id)

  if (!equipment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Equipment Not Found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn&apos;t locate the equipment you were looking for. It may have been archived, unapproved, or removed by its owner.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/equipment">
              <Button className="w-full sm:w-auto gap-2">
                <Search className="h-4 w-4" />
                <span>Browse All Equipment</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Go to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <EquipmentDetailView equipment={equipment} />
}
