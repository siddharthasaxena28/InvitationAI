import type { MetadataRoute } from 'next'
import { OCCASIONS } from '@/lib/occasions'

const BASE = 'https://www.inviteai.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const occasionUrls = OCCASIONS.map((occ) => ({
    url: `${BASE}/occasions/${occ.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/occasions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...occasionUrls,
  ]
}
