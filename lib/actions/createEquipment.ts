"use server"

import { EquipmentInput, CreateEquipmentResponse } from "@/types/equipment"
import { authFetch } from "../unauth"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function createEquipment(
  equipment: EquipmentInput
): Promise<CreateEquipmentResponse> {
  const response = await authFetch(`${BASE_URL}/equipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  })

  return response.json()
}
