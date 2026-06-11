import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const res = await fetch(`${apiUrl}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.get('authorization')
          ? { Authorization: req.headers.get('authorization')! }
          : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json() as unknown
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error('verify-payment proxy error:', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
