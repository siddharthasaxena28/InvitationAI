import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const backendRes = await fetch(`${apiUrl}/api/ai/generate-copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(req.headers.get('authorization')
          ? { Authorization: req.headers.get('authorization')! }
          : {}),
      },
      body: JSON.stringify(body),
    })

    if (!backendRes.ok) {
      return new Response('SSE stream unavailable', { status: backendRes.status })
    }

    // Pass the SSE stream directly to the browser
    return new Response(backendRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('generate-copy proxy error:', err)
    return new Response('Stream error', { status: 500 })
  }
}
