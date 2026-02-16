'use client'

import type { FC } from 'react'
import React from 'react'
import type { ChatMode, ModeConfig } from '@/config/modes'
import { ModeProvider } from '@/context/mode-context'
import Main from '@/app/components'

interface ModePageClientProps {
  mode: ChatMode
  config: ModeConfig
}

const ModePageClient: FC<ModePageClientProps> = ({ mode, config }) => {
  return (
    <ModeProvider mode={mode} config={config}>
      <Main />
    </ModeProvider>
  )
}

export default React.memo(ModePageClient)
