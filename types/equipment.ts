export interface Equipment {
  id?: string
  _id?: string
  name: string
  description: string
  category: string
  location: string
  price: number
  rentalType: "Daily" | "Weekly" | "Monthly" | string
  quantity: number
  condition: string
  brand: string
  model: string
  imageUrl: string
  terms: string
  status: "Pending" | "Approved" | "Rejected" | string
  ownerName: string
  ownerEmail: string
  createdAt?: string
  updatedAt?: string
}

export type EquipmentInput = Omit<Equipment, "id" | "_id"> & {
  id?: string
  _id?: string
}

export interface CreateEquipmentResponse {
  acknowledged?: boolean
  insertedId?: string
  success?: boolean
  message?: string
  [key: string]: unknown
}
