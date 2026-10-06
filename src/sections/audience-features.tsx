import { useEffect, useRef, useState } from "react"
import type { ContentLink } from "@/lib/content"
import { useAudience, type AudienceOption } from "./audience"
import { FeatureSection } from "./feature-section"

export interface FeatureContent {
  name: "source" | "localization" | "history"
  artwork: string
  developers: { title: string; description: string }
  editors: { title: string; description: string }
}

export interface FeatureControls {
  audienceLabelPrefix: string
  primaryAction: ContentLink
  secondaryAction: ContentLink
}

export interface AudienceFeaturesProps {
  features: readonly FeatureContent[]
  controls: FeatureControls
  options: readonly AudienceOption[]
}

// Scroll-driven feature track. The pin/progress bookkeeping is local to this
// block; the audience state comes from the shared store so its per-card
// selector stays in sync with AudienceHero on the same page.
export function AudienceFeatures({
  features,
  controls,
  options,
}: AudienceFeaturesProps) {
  const [audience, setAudience] = useAudience()
  const featuresTrackRef = useRef<HTMLDivElement>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [featuresStuck, setFeaturesStuck] = useState(false)

  useEffect(() => {
    let frame = 0
    let pin: Element | null = null
    let entered = false
    const update = () => {
      frame = 0
      const track = featuresTrackRef.current
      if (!track) return
      pin ??= track.querySelector(".features__pin")
      const rect = track.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const stickyTop = pin ? Number.parseFloat(getComputedStyle(pin).top) : 0
      const pinTop = pin
        ? pin.getBoundingClientRect().top
        : Number.POSITIVE_INFINITY
      const stuck =
        scrollable > 0 &&
        pinTop <= stickyTop + 1 &&
        rect.bottom >= window.innerHeight
      if (stuck) entered = true
      else if (rect.top >= window.innerHeight || rect.bottom <= 0)
        entered = false
      setFeaturesStuck(stuck)
      track.classList.toggle("features--stuck", stuck)
      track.classList.toggle("features--entered", entered)
      if (scrollable <= 0) return
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1)
      setActiveFeature((previous) => {
        const next = Math.min(
          Math.floor(progress * features.length),
          features.length - 1,
        )
        return next === previous ? previous : next
      })
    }
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== 0) cancelAnimationFrame(frame)
    }
  }, [features.length])

  return (
    <div className="audience-sections" data-audience={audience}>
      <div className="features" id="how-it-works" ref={featuresTrackRef}>
        <div className="features__pin">
          {features.map((feature, index) => (
            <FeatureSection
              active={index === activeFeature}
              pinned={featuresStuck}
              key={feature.name}
              feature={feature}
              controls={controls}
              audience={audience}
              options={options}
              onAudienceChange={setAudience}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
