import type { NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import type { ChatMode } from '@/config/modes'
import { getModeConfig, isValidMode } from '@/config/modes'

const clientCache = new Map<string, ChatClient>()

function getModeFromRequest(request: NextRequest): ChatMode {
  const mode = request.headers.get('x-chat-mode') || 'admin'
  if (!isValidMode(mode)) { return 'admin' }
  return mode
}

export function getClient(request: NextRequest): ChatClient {
  const mode = getModeFromRequest(request)
  if (clientCache.has(mode)) { return clientCache.get(mode)! }

  const config = getModeConfig(mode)
  const client = new ChatClient(config.apiKey, config.apiUrl || undefined)
  clientCache.set(mode, client)
  return client
}

export const getInfo = (request: NextRequest) => {
  const mode = getModeFromRequest(request)
  const config = getModeConfig(mode)
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = `user_${config.appId}:${sessionId}`
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}
