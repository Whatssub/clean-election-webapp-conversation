import { notFound } from 'next/navigation'
import type { ChatMode } from '@/config/modes'
import { getModeConfig, isValidMode } from '@/config/modes'
import ModePageClient from './mode-page-client'

interface PageProps {
  params: Promise<{ mode: string }>
}

export default async function ModePage({ params }: PageProps) {
  const { mode } = await params

  if (!isValidMode(mode)) { notFound() }

  const config = getModeConfig(mode as ChatMode)

  return <ModePageClient mode={mode as ChatMode} config={config} />
}
