'use client'
import useAppInsets from '@/hooks/use-app-insets'
import useKeyboardHeight from '@/hooks/use-keyboard-height'

export default function AppInsetsInitializer() {
  useAppInsets()
  useKeyboardHeight()
  return null
}
