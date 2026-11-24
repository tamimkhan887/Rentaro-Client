export const EQUIPMENT_CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
] as const

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]

export interface Equipment {
  id?: string
  _id?: string
  name: string
  description: string
  category: EquipmentCategory | string
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

export interface FavoriteItem {
  _id?: string
  id?: string
  userEmail: string
  equipmentId: string
  equipment: Equipment
  createdAt?: string
}

export interface Booking {
  _id?: string
  id?: string
  equipmentId: string
  equipmentName: string
  equipmentImage: string
  rentalPrice: number
  rentalType: string
  ownerEmail?: string
  ownerName?: string
  userEmail: string
  userName: string
  startDate: string
  endDate: string
  quantity: number
  contactNumber: string
  deliveryAddress: string
  additionalNotes?: string
  totalPrice: number
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | string
  createdAt?: string
}

export type BookingInput = Omit<Booking, "_id" | "id" | "createdAt" | "status"> & {
  status?: string
}
