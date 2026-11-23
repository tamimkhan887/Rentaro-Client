import { EquipmentInput, CreateEquipmentResponse } from "@/types/equipment"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function createEquipment(
  equipment: EquipmentInput
): Promise<CreateEquipmentResponse> {
  const response = await fetch(`${BASE_URL}/equipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  })

  return response.json()
}
