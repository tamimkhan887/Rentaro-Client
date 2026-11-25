import { Equipment } from "@/types/equipment"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export const getSingleEquipment = async (
  id: string
): Promise<Equipment | null> => {
  try {
    const res = await fetch(`${BASE_URL}/equipments/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }
    return await res.json()
  } catch (error) {
    console.error("Error in getSingleEquipment:", error)
    return null
  }
}