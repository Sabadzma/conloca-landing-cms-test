import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import {
  DotLottieReact,
  setWasmUrl,
  type DotLottie,
} from "@lottiefiles/dotlottie-react/webgl"
import wasmUrl from "@lottiefiles/dotlottie-web/webgl/dotlottie-player.wasm?url"

setWasmUrl(wasmUrl)

const lottieStyle = { width: "100%", height: "100%" } as const
const renderConfig = { devicePixelRatio: 1, freezeOnOffscreen: true } as const

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export interface BentoLottieProps {
  src: string
  /** Skips defective leading frames: playback and initial paint start here */
  startFrame?: number
  /** Play the animation backwards when the pointer leaves the card */
  reverseOnLeave?: boolean
}

export function BentoLottie({
  src,
  startFrame,
  reverseOnLeave = true,
}: BentoLottieProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<DotLottie | null>(null)
  const appearedRef = useRef(false)
  const autoPlayedRef = useRef(false)
  const [active, setActive] = useState(false)
  const enabled = useSyncExternalStore(
    subscribeReducedMotion,
    motionAllowed,
    () => false,
  )
  const firstFrame = startFrame ?? 0

  const autoPlay = useCallback(() => {
    const player = playerRef.current
    if (!player || !player.isLoaded || autoPlayedRef.current) return
    if (!appearedRef.current) return
    autoPlayedRef.current = true
    player.setMode("forward")
    player.setFrame(firstFrame)
    player.play()
  }, [firstFrame])

  const handlePlayer = useCallback(
    (player: DotLottie | null) => {
      playerRef.current = player
      setActive(player !== null)
      if (player) {
        player.addEventListener("load", () => {
          if (startFrame) {
            player.setSegment(startFrame, player.totalFrames - 1)
            player.setFrame(startFrame)
          }
          autoPlay()
        })
      }
    },
    [startFrame, autoPlay],
  )

  // Mobile stack layout (<=639px): play once on first appearance
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!enabled || !wrapper) return
    if (!window.matchMedia("(max-width: 639px)").matches) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || autoPlayedRef.current) continue
        appearedRef.current = true
        autoPlay()
        if (autoPlayedRef.current) observer.disconnect()
      }
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [enabled, autoPlay])

  useEffect(() => {
    const card = wrapperRef.current?.closest(".bento-card")
    if (!enabled || !card) return
    const playForward = () => {
      const player = playerRef.current
      if (!player || !player.isLoaded) return
      appearedRef.current = true
      autoPlayedRef.current = true
      player.setMode("forward")
      if (player.currentFrame >= player.totalFrames - 1)
        player.setFrame(firstFrame)
      player.play()
    }
    const playReverse = () => {
      const player = playerRef.current
      if (!player || !player.isLoaded) return
      player.setMode("reverse")
      player.play()
    }
    card.addEventListener("mouseenter", playForward)
    if (reverseOnLeave) card.addEventListener("mouseleave", playReverse)
    return () => {
      card.removeEventListener("mouseenter", playForward)
      card.removeEventListener("mouseleave", playReverse)
    }
  }, [enabled, firstFrame, reverseOnLeave])

  return (
    <div
      className="bento-lottie"
      aria-hidden="true"
      ref={wrapperRef}
      data-active={active || undefined}
    >
      {enabled && (
        <DotLottieReact
          src={src}
          renderConfig={renderConfig}
          dotLottieRefCallback={handlePlayer}
          style={lottieStyle}
        />
      )}
    </div>
  )
}
