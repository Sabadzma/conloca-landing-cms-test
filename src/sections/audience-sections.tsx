import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react"
import {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
} from "@conloca-design-system/components/conloca-dialog"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import type { Audience, AudienceContent } from "@/homepage-content"
import { HeroSection } from "./hero-section"
import {
  FeatureSection,
  type FeatureDirection,
  type FeatureMotion,
} from "./feature-section"

export interface AudienceSectionsProps {
  content: AudienceContent
}

type ScrollSnap = {
  engaged: boolean
  active: number
  lo: number
  hi: number
  dir: FeatureDirection
}

const initialSnap: ScrollSnap = {
  engaged: false,
  active: 0,
  lo: 0,
  hi: 0,
  dir: "down",
}

export function AudienceSections({ content }: AudienceSectionsProps) {
  const lastIndex = content.features.length - 1
  const [audience, setAudience] = useState<Audience>("developers")
  const [videoOpen, setVideoOpen] = useState(false)
  const lastVideoTrigger = useRef<HTMLElement | null>(null)
  const openVideo = useCallback((event: MouseEvent<HTMLElement>) => {
    lastVideoTrigger.current = event.currentTarget
    setVideoOpen(true)
  }, [])
  const selectAudience = useCallback((value: string) => {
    if (value === "developers" || value === "editors") setAudience(value)
  }, [])
  const featuresTrackRef = useRef<HTMLDivElement>(null)
  const featuresPinRef = useRef<HTMLDivElement>(null)
  const [snap, setSnap] = useState<ScrollSnap>(initialSnap)

  // Scroll-driven choreography. The pin docks full-viewport once the banner
  // card touches the viewport top; every viewport of scrolling after that
  // scrubs one slide transition through --feature-progress. No input
  // hijacking: wheel, touch, keyboard, and scrollbar all map to the same
  // scroll position, and transitions reverse with it.
  useEffect(() => {
    const track = featuresTrackRef.current
    const pin = featuresPinRef.current
    if (!track || !pin) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const viewport = window.innerHeight
      // The pin is 100vh + inset tall, so its overhang equals the banner's
      // top inset at every breakpoint without reading computed styles.
      const insetTop = pin.getBoundingClientRect().height - viewport
      const progress = Math.min(
        Math.max((-rect.top - insetTop) / viewport, 0),
        lastIndex + 1,
      )
      track.style.setProperty("--feature-progress", progress.toFixed(4))
      const engaged = rect.top <= -insetTop && rect.bottom >= viewport
      track.classList.toggle("features--stuck", engaged)
      const clamp = (value: number) => Math.min(Math.max(value, 0), lastIndex)
      const lo = clamp(Math.floor(progress))
      const hi = clamp(Math.ceil(progress))
      const active = clamp(Math.round(progress))
      setSnap((prev) => {
        if (
          prev.engaged === engaged &&
          prev.active === active &&
          prev.lo === lo &&
          prev.hi === hi
        ) {
          return prev
        }
        const dir: FeatureDirection =
          !prev.engaged && engaged
            ? progress > active
              ? "up"
              : "down"
            : active > prev.active
              ? "down"
              : active < prev.active
                ? "up"
                : prev.dir
        return { engaged, active, lo, hi, dir }
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [lastIndex])

  // The appearing animation replays on every engage and every slide change;
  // leaving the section resets it so the next visit starts from scratch.
  // Derived during render: only the active slide's enter timer can fire
  // onEnterEnd, so the flag always belongs to the current transition.
  const transitionKey = snap.engaged ? snap.active : -1
  const [enterState, setEnterState] = useState({ key: -1, done: false })
  if (enterState.key !== transitionKey) {
    setEnterState({ key: transitionKey, done: false })
  }
  const phase: FeatureMotion =
    transitionKey === -1 ? "idle" : enterState.done ? "shown" : "enter"

  const handleEnterEnd = useCallback(() => {
    setEnterState((current) => ({ ...current, done: true }))
  }, [])

  const trackStyle = useMemo(
    () => ({ "--slide-count": content.features.length }) as CSSProperties,
    [content.features.length],
  )

  return (
    <div className="audience-sections" data-audience={audience}>
      <HeroSection
        content={content.hero}
        audience={audience}
        options={content.options}
        onAudienceChange={selectAudience}
        onOpenVideo={openVideo}
      />
      <div
        className="features"
        id="how-it-works"
        ref={featuresTrackRef}
        style={trackStyle}
      >
        <div className="features__pin" data-dir={snap.dir} ref={featuresPinRef}>
          <div
            className="features__bg"
            data-feature={content.features[snap.active].name}
          />
          <div className="feature-audience">
            <ConlocaSegmentedControl
              aria-label={content.featureControls.audienceLabelPrefix}
              options={content.options}
              value={audience}
              onValueChange={selectAudience}
              transparent
            />
          </div>
          {content.features.map((feature, index) => {
            const motion: FeatureMotion = !snap.engaged
              ? "idle"
              : index === snap.active
                ? phase
                : index >= snap.lo && index <= snap.hi
                  ? "shown"
                  : "idle"
            return (
              <FeatureSection
                key={feature.name}
                index={index}
                motion={motion}
                active={snap.engaged && index === snap.active}
                direction={snap.dir}
                feature={feature}
                controls={content.featureControls}
                audience={audience}
                onEnterEnd={handleEnterEnd}
              />
            )
          })}
        </div>
      </div>
      <ConlocaDialog open={videoOpen} onOpenChange={setVideoOpen}>
        <ConlocaDialogContent
          className="video-dialog"
          closeLabel={content.hero.video.closeLabel}
          finalFocus={lastVideoTrigger}
        >
          <ConlocaDialogTitle className="sr-only">
            {content.hero.video.title}
          </ConlocaDialogTitle>
          {/* YouTube needs scripts and its origin for playback; it is cross-origin to this site. */}
          {/* oxlint-disable react/iframe-missing-sandbox */}
          {videoOpen && (
            <iframe
              title={content.hero.video.title}
              src={content.hero.video.url}
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </ConlocaDialogContent>
      </ConlocaDialog>
    </div>
  )
}
