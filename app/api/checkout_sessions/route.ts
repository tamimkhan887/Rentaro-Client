import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const contentType = headersList.get('content-type') || ''
    const origin =
      headersList.get('origin') ||
      headersList.get('referer')?.replace(/\/[^/]*$/, '') ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      'http://localhost:3000'

    let data: Record<string, any> = {}

    if (contentType.includes('application/json')) {
      data = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      formData.forEach((val, key) => {
        data[key] = val.toString()
      })
    } else {
      try {
        data = await req.json()
      } catch {
        // Fallback
      }
    }

    const {
      equipmentId,
      equipmentName,
      equipmentImage,
      rentalPrice,
      rentalType,
      ownerEmail,
      ownerName,
      userEmail,
      userName,
      startDate,
      endDate,
      quantity,
      contactNumber,
      deliveryAddress,
      additionalNotes,
      totalPrice,
    } = data

    if (!equipmentId || !userEmail || !startDate || !endDate || !contactNumber || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Missing required booking information. Please complete all required fields.' },
        { status: 400 }
      )
    }

    // Minimum $0.50 for Stripe USD payments, price converted to cents
    const parsedTotal = Number(totalPrice) || 0
    const unitAmount = Math.max(50, Math.round(parsedTotal * 100))

    const parsedQty = Math.max(1, parseInt(String(quantity || 1), 10) || 1)

    // Verify equipment availability and live stock
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const eqRes = await fetch(`${backendUrl}/equipments/${equipmentId}`, {
        cache: 'no-store',
      })
      if (eqRes.ok) {
        const eqData = await eqRes.json()
        const availableStock = Number(eqData?.quantity ?? 0)
        if (availableStock < parsedQty) {
          return NextResponse.json(
            {
              error:
                availableStock <= 0
                  ? 'This equipment is currently out of stock.'
                  : `Insufficient stock. Only ${availableStock} unit(s) available in stock.`,
            },
            { status: 400 }
          )
        }
      }
    } catch (checkErr) {
      console.warn('Could not verify live stock before checkout:', checkErr)
    }

    const validImages =
      equipmentImage && typeof equipmentImage === 'string' && equipmentImage.startsWith('http')
        ? [equipmentImage]
        : []

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${equipmentName || 'Heavy Equipment'} (${rentalType || 'Daily'} Rental)`,
              description: `Rental Period: ${startDate} to ${endDate} (${parsedQty} unit) • Delivery: ${deliveryAddress}`,
              images: validImages,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail,
      metadata: {
        equipmentId: String(equipmentId),
        equipmentName: String(equipmentName || ''),
        equipmentImage: String(equipmentImage || ''),
        rentalPrice: String(rentalPrice || 0),
        rentalType: String(rentalType || 'Daily'),
        ownerEmail: String(ownerEmail || ''),
        ownerName: String(ownerName || ''),
        userEmail: String(userEmail),
        userName: String(userName || 'Customer'),
        startDate: String(startDate),
        endDate: String(endDate),
        quantity: String(parsedQty),
        contactNumber: String(contactNumber),
        deliveryAddress: String(deliveryAddress),
        additionalNotes: String(additionalNotes || ''),
        totalPrice: String(parsedTotal),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/equipment/${equipmentId}?payment_canceled=true`,
    })

    if (contentType.includes('application/x-www-form-urlencoded')) {
      return NextResponse.redirect(session.url as string, 303)
    }

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('Error creating Stripe Checkout Session:', err)
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
