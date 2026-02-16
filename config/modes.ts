import type { AppInfo } from '@/types/app'

export type ChatMode = 'admin' | 'fund'

export const VALID_MODES: ChatMode[] = ['admin', 'fund']

export interface ModeConfig {
  appId: string
  apiKey: string
  apiUrl: string
  appInfo: AppInfo
}

const modeConfigs: Record<ChatMode, ModeConfig> = {
  admin: {
    appId: `${process.env.NEXT_PUBLIC_ADMIN_APP_ID}`,
    apiKey: `${process.env.NEXT_PUBLIC_ADMIN_APP_KEY}`,
    apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    appInfo: {
      title: '행정질의',
      description: '',
      copyright: '',
      privacy_policy: '',
      default_language: 'ko',
      disable_session_same_site: false,
    },
  },
  fund: {
    appId: `${process.env.NEXT_PUBLIC_FUND_APP_ID}`,
    apiKey: `${process.env.NEXT_PUBLIC_FUND_APP_KEY}`,
    apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    appInfo: {
      title: '자금질의',
      description: '',
      copyright: '',
      privacy_policy: '',
      default_language: 'ko',
      disable_session_same_site: false,
    },
  },
}

export function getModeConfig(mode: ChatMode): ModeConfig {
  return modeConfigs[mode]
}

export function isValidMode(mode: string): mode is ChatMode {
  return VALID_MODES.includes(mode as ChatMode)
}
