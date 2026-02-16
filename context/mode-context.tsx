'use client'

import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ChatMode, ModeConfig } from '@/config/modes'

interface ModeContextValue {
  mode: ChatMode
  config: ModeConfig
}

const ModeContext = createContext<ModeContextValue | null>(null)

export function useModeConfig(): ModeContextValue {
  const ctx = useContext(ModeContext)
  if (!ctx) { throw new Error('useModeConfig must be used within ModeProvider') }
  return ctx
}

interface ModeProviderProps {
  mode: ChatMode
  config: ModeConfig
  children: ReactNode
}

export const ModeProvider: FC<ModeProviderProps> = ({ mode, config, children }) => {
  return (
    <ModeContext.Provider value={{ mode, config }}>
      {children}
    </ModeContext.Provider>
  )
}
