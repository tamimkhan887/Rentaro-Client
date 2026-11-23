import { PlusCircle, Upload, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OwnerAddEquipmentPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Add New Equipment
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          List a new machine, excavator, or tool to earn daily rental revenue.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Equipment Name / Model</Label>
          <Input placeholder="e.g. Caterpillar 320 Hydraulic Excavator" className="h-10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Category</Label>
            <Input placeholder="Excavation / Earthmoving / Hauling" className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Daily Rental Rate ($)</Label>
            <Input placeholder="e.g. 350" type="number" className="h-10 rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Equipment Direct Photo URL</Label>
          <Input placeholder="https://example.com/machine-image.jpg" className="h-10 rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Location / Depot Address</Label>
          <Input placeholder="e.g. Dhaka Industrial Zone, Yard #4" className="h-10 rounded-xl" />
        </div>

        <Button variant="brand" size="lg" className="w-full h-11 rounded-xl text-sm font-semibold mt-4 cursor-pointer">
          <PlusCircle className="size-4 mr-2" />
          <span>Publish Equipment Listing</span>
        </Button>
      </div>
    </div>
  )
}
