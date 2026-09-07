import {
  useCallback,
  useEffect,
  useState,
  type FocusEvent,
  type MouseEvent,
} from "react"
import { ConlocaCarouselProgress } from "@conloca-design-system/components/conloca-carousel-progress"
import type { HeroContent, HeroMessages } from "@/homepage-content"
import { useCarouselPlayback } from "@/use-carousel-playback"

export function HeroCarousel({
  messages,
  labels,
}: {
  messages: HeroMessages
  labels: HeroContent["carousel"]
}) {
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pageVisible, setPageVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const startHover = useCallback(() => setHovered(true), [])
  const endHover = useCallback(() => setHovered(false), [])
  const startFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
  }, [])
  const togglePause = useCallback(() => setPaused((current) => !current), [])
  const running =
    !paused && !hovered && !focused && !reducedMotion && pageVisible
  const { slide, progress, selectSlide } = useCarouselPlayback(
    messages.length,
    running,
  )
  const message = messages[slide] ?? messages[0]
  const handleSlideSelect = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      selectSlide(Number(event.currentTarget.dataset.slide))
      setPaused(true)
    },
    [selectSlide],
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  return (
    <div
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label={labels.label}
      data-running={running}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onFocusCapture={startFocus}
      onBlurCapture={handleBlur}
    >
      <div className="hero-indicator-space">
        <div className="hero-indicators" aria-label={labels.chooseLabel}>
          {messages.map((item, index) => (
            <button
              key={item[0]}
              type="button"
              className="hero-indicator-button"
              aria-label={labels.showLabel + (index + 1)}
              aria-pressed={slide === index}
              data-slide={index}
              onClick={handleSlideSelect}
            >
              <ConlocaCarouselProgress
                active={slide === index}
                value={slide === index ? progress : 0}
                aria-hidden="true"
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      </div>
      <p className="hero-message" aria-live={paused ? "polite" : "off"}>
        <strong>{message[0]}</strong>
        {message[1]}
      </p>
      <button className="carousel-pause" type="button" onClick={togglePause}>
        {paused ? labels.playLabel : labels.pauseLabel}
      </button>
    </div>
  )
}
