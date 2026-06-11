import nextDynamic from 'next/dynamic'
import { MOCK_TEMPLATES } from '@/lib/mock-data'
import type { Template } from '@/lib/types'

export const dynamic = 'force-dynamic'

const EditorShell = nextDynamic(() => import('@/components/Editor/EditorShell'), { ssr: false })

interface PageProps {
  params: { templateId: string }
}

async function getTemplate(id: string): Promise<Template | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const res = await fetch(`${apiUrl}/api/templates/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error()
    return res.json() as Promise<Template>
  } catch {
    return MOCK_TEMPLATES.find((t) => t.id === id) || MOCK_TEMPLATES[0]
  }
}

export default async function EditorPage({ params }: PageProps) {
  const template = await getTemplate(params.templateId)
  if (!template) return null

  return <EditorShell template={template} />
}
