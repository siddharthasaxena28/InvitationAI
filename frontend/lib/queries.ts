'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTemplates, fetchTemplate, createPaymentOrder, verifyPayment } from './api-client'
import { MOCK_TEMPLATES } from './mock-data'
import type { TemplateFilters } from './types'

export function useTemplates(filters: TemplateFilters = {}) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: async () => {
      try {
        return await fetchTemplates(filters as Record<string, string | number>)
      } catch {
        // Apply all filters locally against mock data
        let items = filters.occasion
          ? MOCK_TEMPLATES.filter(t => t.occasion_slug === filters.occasion)
          : [...MOCK_TEMPLATES]

        if (filters.style?.length) {
          const styleSet = filters.style
          items = items.filter(t => styleSet.some(s => t.style_tags.includes(s)))
        }
        if (filters.orientation) {
          items = items.filter(t => t.orientation === filters.orientation)
        }
        if (filters.price_max !== undefined) {
          items = items.filter(t => t.price_inr <= (filters.price_max as number))
        }

        if (!items.length) items = MOCK_TEMPLATES.slice(0, 12)
        return { items, total: items.length, page: 1, per_page: 20 }
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      try {
        return await fetchTemplate(id)
      } catch {
        return MOCK_TEMPLATES.find(t => t.id === id) ?? MOCK_TEMPLATES[0]
      }
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  })
}

export function useCreateOrder() {
  return useMutation({ mutationFn: createPaymentOrder })
}

export function useVerifyPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
  })
}
