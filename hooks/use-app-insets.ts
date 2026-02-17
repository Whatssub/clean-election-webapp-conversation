'use client'
import { useEffect } from 'react'

interface NativeInsets {
  top: number
}

declare global {
  interface Window {
    __NATIVE_INSETS__?: NativeInsets
  }
}

/**
 * Detects safe area insets from native bridge, URL params, or webview context,
 * and updates CSS custom property (--app-inset-top).
 *
 * Bottom inset is handled by the native app (KeyboardAvoidingView + padding).
 *
 * Priority:
 * 1. Native bridge (window.__NATIVE_INSETS__) — exact values
 * 2. URL query params (?insetTop=44) — simple native integration
 * 3. CSS env() fallback — declared in globals.css (normal browser)
 */
export default function useAppInsets() {
  useEffect(() => {
    if (typeof window === 'undefined') { return }

    const root = document.documentElement

    // Priority 1: Native bridge
    if (window.__NATIVE_INSETS__) {
      const { top } = window.__NATIVE_INSETS__
      root.style.setProperty('--app-inset-top', `${top}px`)
      return
    }

    // Priority 2: URL query params
    const params = new URLSearchParams(window.location.search)
    const insetTop = params.get('insetTop')
    if (insetTop) {
      root.style.setProperty('--app-inset-top', `${insetTop}px`)
    }

    // Priority 3: CSS env() defaults from globals.css apply automatically
  }, [])
}
