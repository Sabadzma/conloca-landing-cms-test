import { useCallback, useEffect, useRef, useState } from "react"

export const HERO_SLIDE_DURATION_MS = 8000

/** One elapsed-time clock keeps the progress fill and slide changes synchronized. */
export function useCarouselPlayback(slideCount: number, running: boolean) {
  const [playback, setPlayback] = useState({ slide: 0, progress: 0 })
  const elapsed = useRef(0)

  const selectSlide = useCallback((slide: number) => {
    elapsed.current = 0
    setPlayback({ slide, progress: 0 })
  }, [])

  useEffect(() => {
    if (!running) return
    let previousTime = performance.now()
    let animationFrame: number

    const tick = (time: number) => {
      const total = elapsed.current + Math.max(0, time - previousTime)
      previousTime = time
      const advances = Math.floor(total / HERO_SLIDE_DURATION_MS)
      elapsed.current = total % HERO_SLIDE_DURATION_MS
      const progress = (elapsed.current / HERO_SLIDE_DURATION_MS) * 100
      setPlayback((current) => ({
        slide: (current.slide + advances) % slideCount,
        progress,
      }))
      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrame)
  }, [running, slideCount])

  return { ...playback, selectSlide }
}
