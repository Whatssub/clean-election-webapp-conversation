'use client'
import { useEffect } from 'react'

interface NativeInsets {
  top: number
  bottom: number
}

declare global {
  interface Window {
    __NATIVE_INSETS__?: NativeInsets
  }
}

const ESTIMATED_TAB_BAR_HEIGHT = 49

function detectWebview(): boolean {
  if (typeof window === 'undefined') { return false }

  const ua = navigator.userAgent.toLowerCase()

  // Exclude PWA/standalone
  if (window.matchMedia('(display-mode: standalone)').matches) { return false }

  // iOS webview: iOS UA but NOT Safari/Chrome/Firefox
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isIOSWebview = isIOS && !/(safari|fxios|crios)/.test(ua)

  // Android webview
  const isAndroidWebview = /android/.test(ua) && /wv|\.0\.0\.0/.test(ua)

  // Common native bridge objects
  const hasNativeBridge
    = (window as any).ReactNativeWebView !== undefined
      || (window as any).webkit?.messageHandlers !== undefined
      || (window as any).Android !== undefined

  return isIOSWebview || isAndroidWebview || hasNativeBridge
}

/**
 * Detects safe area insets from native bridge or webview context,
 * and updates CSS custom properties (--app-inset-top, --app-inset-bottom).
 *
 * Priority:
 * 1. Native bridge (window.__NATIVE_INSETS__) — exact values
 * 2. Webview detection — device safe area + estimated tab bar
 * 3. CSS env() fallback — declared in globals.css (normal browser)
 */
export default function useAppInsets() {
  useEffect(() => {
    if (typeof window === 'undefined') { return }

    const root = document.documentElement

    // Priority 1: Native bridge
    if (window.__NATIVE_INSETS__) {
      const { top, bottom } = window.__NATIVE_INSETS__
      root.style.setProperty('--app-inset-top', `${top}px`)
      root.style.setProperty('--app-inset-bottom', `${bottom}px`)
      return
    }

    // Priority 2: Webview fallback
    if (detectWebview()) {
      // Read the current env() value that CSS set as default
      const temp = document.createElement('div')
      temp.style.height = 'env(safe-area-inset-bottom, 0px)'
      document.body.appendChild(temp)
      const deviceBottom = temp.getBoundingClientRect().height
      document.body.removeChild(temp)

      const totalBottom = deviceBottom + ESTIMATED_TAB_BAR_HEIGHT
      root.style.setProperty('--app-inset-bottom', `${totalBottom}px`)
    }

    // Priority 3: CSS env() defaults from globals.css apply automatically
  }, [])
}
