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

const ESTIMATED_TAB_BAR_HEIGHT = 65

/**
 * Detects safe area insets from native bridge, URL params, or webview context,
 * and updates CSS custom properties (--app-inset-top, --app-inset-bottom).
 *
 * Priority:
 * 1. Native bridge (window.__NATIVE_INSETS__) — exact values
 * 2. URL query params (?insetTop=44&insetBottom=83) — simple native integration
 * 3. Webview detection — device safe area + estimated tab bar
 * 4. CSS env() fallback — declared in globals.css (normal browser)
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

    // Priority 2: URL query params
    const params = new URLSearchParams(window.location.search)
    const insetTop = params.get('insetTop')
    const insetBottom = params.get('insetBottom')
    if (insetBottom) {
      if (insetTop) { root.style.setProperty('--app-inset-top', `${insetTop}px`) }
      root.style.setProperty('--app-inset-bottom', `${insetBottom}px`)
      return
    }

    // Priority 3: Webview fallback (broader detection)
    if (detectWebview()) {
      const deviceBottom = measureEnvValue('safe-area-inset-bottom')
      const totalBottom = deviceBottom + ESTIMATED_TAB_BAR_HEIGHT
      root.style.setProperty('--app-inset-bottom', `${totalBottom}px`)
    }

    // Priority 4: CSS env() defaults from globals.css apply automatically
  }, [])
}

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

  // Broader: any non-standalone iOS context without full Safari chrome
  // This catches WKWebView even when UA includes "Safari"
  const isIOSEmbedded = isIOS && !window.navigator.standalone && window.innerHeight < screen.height - 100

  return isIOSWebview || isAndroidWebview || hasNativeBridge || isIOSEmbedded
}

/** Measure a CSS env() value by temporarily attaching a div */
function measureEnvValue(envName: string): number {
  const temp = document.createElement('div')
  temp.style.position = 'fixed'
  temp.style.visibility = 'hidden'
  temp.style.height = `env(${envName}, 0px)`
  document.body.appendChild(temp)
  const value = temp.getBoundingClientRect().height
  document.body.removeChild(temp)
  return value
}
