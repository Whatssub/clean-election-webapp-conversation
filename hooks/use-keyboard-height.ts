'use client'
import { useEffect, useRef } from 'react'

const KEYBOARD_THRESHOLD = 100

/**
 * Detects virtual keyboard presence using the VisualViewport API
 * and dynamically updates --input-bar-bottom-offset CSS variable.
 *
 * When keyboard is open:  --input-bar-bottom-offset = keyboard height (px)
 * When keyboard is closed: --input-bar-bottom-offset = var(--app-inset-bottom)
 */
export default function useKeyboardHeight() {
  const keyboardOpenRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') { return }
    const vv = window.visualViewport
    if (!vv) { return }

    const root = document.documentElement

    const handleResize = () => {
      const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop

      if (keyboardHeight > KEYBOARD_THRESHOLD) {
        keyboardOpenRef.current = true
        root.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
        root.style.setProperty('--input-bar-bottom-offset', `${keyboardHeight}px`)
      } else if (keyboardOpenRef.current) {
        keyboardOpenRef.current = false
        root.style.setProperty('--keyboard-height', '0px')
        root.style.setProperty('--input-bar-bottom-offset', 'var(--app-inset-bottom)')
      }
    }

    const handleScroll = () => {
      if (!keyboardOpenRef.current) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
    }

    vv.addEventListener('resize', handleResize)
    vv.addEventListener('scroll', handleScroll)
    handleResize()

    return () => {
      vv.removeEventListener('resize', handleResize)
      vv.removeEventListener('scroll', handleScroll)
      root.style.setProperty('--keyboard-height', '0px')
      root.style.setProperty('--input-bar-bottom-offset', 'var(--app-inset-bottom)')
    }
  }, [])
}
