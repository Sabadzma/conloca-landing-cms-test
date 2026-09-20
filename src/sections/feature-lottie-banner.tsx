import { useCallback, useEffect, useRef, useState } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react/webgl"
import type { DotLottie } from "@lottiefiles/dotlottie-web"
import { cn } from "@/lib/utils"

type MotionPhase = "idle" | "appear" | "loop"

export interface FeatureLottieBannerProps {
  /** dotLottie package URL, e.g. "/assets/Lotties/feature-02.lottie" */
  src: string
  /** Last frame of the appear animation (played once). */
  appearEnd: number
  /** Last frame of the loop animation (repeated forward from appearEnd). */
  loopEnd: number
  play?: boolean
  className?: string
}

/* Two-phase dotLottie playback for homepage feature slides:
   appear [0, appearEnd) once on play, then loop [appearEnd, loopEnd) forever.
   play=false resets to a blank frame 0; reduced motion freezes on appearEnd. */
export function FeatureLottieBanner({
  src,
  appearEnd,
  loopEnd,
  play = false,
  className,
}: FeatureLottieBannerProps) {
  const playerRef = useRef<DotLottie | null>(null)
  const phaseRef = useRef<MotionPhase>("idle")
  const [ready, setReady] = useState(false)

  const handleComplete = useCallback(() => {
    const player = playerRef.current
    if (!player || phaseRef.current !== "appear") return
    phaseRef.current = "loop"
    player.setSegment(appearEnd, loopEnd)
    player.setLoop(true)
    player.play()
  }, [appearEnd, loopEnd])

  const handlePlayer = useCallback(
    (player: DotLottie | null) => {
      playerRef.current = player
      if (!player) return
      player.addEventListener("complete", handleComplete)
      player.addEventListener("load", () => setReady(true))
    },
    [handleComplete],
  )

  useEffect(() => {
    const player = playerRef.current
    if (!player || !ready) return
    if (play) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        phaseRef.current = "loop"
        player.setSegment(appearEnd, loopEnd)
        player.setFrame(appearEnd)
        return
      }
      if (phaseRef.current !== "idle") return
      phaseRef.current = "appear"
      player.setSegment(0, appearEnd)
      player.setLoop(false)
      player.play()
    } else {
      phaseRef.current = "idle"
      player.stop()
      player.setSegment(0, appearEnd)
      player.setFrame(0)
    }
  }, [play, ready, appearEnd, loopEnd])

  return (
    <DotLottieReact
      src={src}
      autoplay={false}
      loop={false}
      dotLottieRefCallback={handlePlayer}
      className={cn("feature-lottie-banner", className)}
      aria-hidden="true"
    />
  )
}
