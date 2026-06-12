const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const REQUEST_TIMEOUT_MS = 12000

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: controller.signal,
      ...options,
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new ApiError(res.status, (error as Record<string, string>).detail || 'Request failed')
    }
    return res.json() as Promise<T>
  } catch (err) {
    if (err instanceof ApiError) throw err
    if ((err as Error).name === 'AbortError') throw new ApiError(0, 'Request timed out. Please try again.')
    throw new ApiError(0, 'Network error. Please check your connection.')
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function fetchTemplates(filters: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)) })
  const qs = params.toString()
  return apiRequest<{ items: import('./types').Template[]; total: number; page: number; per_page: number }>(
    `/api/templates${qs ? '?' + qs : ''}`
  )
}

export async function fetchTemplate(id: string) {
  return apiRequest<import('./types').Template>(`/api/templates/${id}`)
}

export async function createPaymentOrder(data: { template_id: string; amount_inr: number; email?: string }) {
  return apiRequest<import('./types').PaymentOrder>('/api/payments/create-order', {
    method: 'POST', body: JSON.stringify(data),
  })
}

export async function verifyPayment(data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  order_id: string
}) {
  return apiRequest<{ success: boolean; download_token: string; order_id: string }>('/api/payments/verify', {
    method: 'POST', body: JSON.stringify(data),
  })
}

export async function triggerHdRender(data: { download_token: string; order_id: string }) {
  return apiRequest<{ task_id: string; status: string }>('/api/render/hd', {
    method: 'POST', body: JSON.stringify(data),
  })
}

export async function getRenderStatus(taskId: string) {
  return apiRequest<{ status: string; result?: { png_url: string; pdf_url: string } }>(
    `/api/render/status/${taskId}`
  )
}

export async function buildWhatsAppShareUrl(data: {
  event_title: string
  event_date: string
  venue: string
  download_url: string
}) {
  return apiRequest<{ whatsapp_url: string }>('/api/share/whatsapp', {
    method: 'POST', body: JSON.stringify(data),
  })
}
