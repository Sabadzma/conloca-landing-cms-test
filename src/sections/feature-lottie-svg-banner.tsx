import { useEffect, useRef, useState } from "react"
import type { AnimationItem } from "lottie-web"
import { cn } from "@/lib/utils"

type MotionPhase = "idle" | "appear" | "loop"

export interface FeatureLottieSvgBannerProps {
  /** Bodymovin animation JSON URL, e.g. "/assets/Lotties/feature-03/animation.json" */
  src: string
  /** Last frame of the appear animation (played once). */
  appearEnd: number
  /** Last frame of the loop animation (repeated forward from appearEnd). */
  loopEnd: number
  play?: boolean
  className?: string
}

/* Two-phase lottie-web (SVG renderer) playback for homepage feature slides.
   The SVG renderer scales with native viewBox semantics, so slot geometry is
   exact at any size and resolution-independent. Same choreography as
   FeatureLottieBanner: appear once on play, then loop forward forever;
   play=false resets to a blank frame 0; reduced motion freezes on appearEnd. */
export function FeatureLottieSvgBanner({
  src,
  appearEnd,
  loopEnd,
  play = false,
  className,
}: FeatureLottieSvgBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const phaseRef = useRef<MotionPhase>("idle")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    let anim: AnimationItem | null = null
    /* lottie-web touches canvas at module scope, which jsdom cannot provide;
       import lazily so tests and SSR never evaluate it. */
    void import("lottie-web").then(({ default: lottie }) => {
      if (cancelled) return
      const item = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src,
      })
      anim = item
      animRef.current = item
      item.addEventListener("DOMLoaded", () => setReady(true))
      item.addEventListener("complete", () => {
        if (phaseRef.current !== "appear") return
        phaseRef.current = "loop"
        item.setLoop(true)
        item.playSegments([[appearEnd, loopEnd]], true)
        item.play()
      })
    })
    return () => {
      cancelled = true
      anim?.destroy()
      animRef.current = null
    }
  }, [src, appearEnd, loopEnd])

  useEffect(() => {
    const anim = animRef.current
    if (!anim || !ready) return
    if (play) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        phaseRef.current = "loop"
        anim.goToAndStop(appearEnd, true)
        return
      }
      if (phaseRef.current !== "idle") return
      phaseRef.current = "appear"
      anim.setLoop(false)
      anim.playSegments([[0, appearEnd]], true)
      anim.play()
    } else {
      phaseRef.current = "idle"
      anim.stop()
      anim.goToAndStop(0, true)
    }
  }, [play, ready, appearEnd])

  return (
    <div
      ref={containerRef}
      className={cn("feature-lottie-svg-banner", className)}
      aria-hidden="true"
    />
  )
}
