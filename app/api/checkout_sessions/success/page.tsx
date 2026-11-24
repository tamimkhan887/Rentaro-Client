import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function Success({ searchParams }: Props) {
  const { session_id } = await searchParams
  redirect(`/checkout/success${session_id ? `?session_id=${session_id}` : ""}`)
}
