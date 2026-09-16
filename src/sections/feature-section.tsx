import { useEffect, useMemo, type CSSProperties } from "react"
import type { Audience, FeatureContent, FeatureControls } from "@/homepage-content"
import { cn } from "@/lib/utils"
import { SectionLink } from "./section-link"
import { FeatureBanner5 } from "./feature-banner-5"

export type FeatureMotion = "idle" | "enter" | "shown"
export type FeatureDirection = "down" | "up"

export interface FeatureSectionProps {
  index: number
  motion: FeatureMotion
  active: boolean
  direction: FeatureDirection
  feature: FeatureContent
  controls: FeatureControls
  audience: Audience
  onEnterEnd: () => void
}
export function FeatureSection({
  index,
  motion,
  active,
  direction,
  feature,
  controls,
  audience,
  onEnterEnd,
}: FeatureSectionProps) {
  const interactive = active && motion !== "idle"
  const slideStyle = useMemo(
    () => ({ "--slide-index": index }) as CSSProperties,
    [index],
  )
  // time-based, so a single timer covers the staggered copy and artwork.
  useEffect(() => {
    if (motion !== "enter") return
    const id = window.setTimeout(onEnterEnd, 720)
    return () => window.clearTimeout(id)
  }, [motion, onEnterEnd])

  return (
    <section
      aria-labelledby={"feature-" + feature.name}
      className={cn(
        "feature",
        "feature-" + feature.name,
        interactive && "feature--active",
        motion !== "idle" && "feature--" + motion,
      )}
      data-dir={direction}
      style={slideStyle}
      inert={!interactive}
    >
      <div className="feature-audience-slot" />
      <div className="feature-content">
        <div className="feature-copy">
          <div className="feature-text">
            <h2 id={"feature-" + feature.name}>{feature[audience].title}</h2>
            <p>{feature[audience].description}</p>
          </div>
          <div className="feature-actions">
            <SectionLink href={controls.primaryAction.url}>
              {controls.primaryAction.label}
            </SectionLink>
            <SectionLink
              variant="secondary"
              href={controls.secondaryAction.url}
            >
              {controls.secondaryAction.label}
            </SectionLink>
          </div>
        </div>
        <div className="feature-artwork" aria-hidden="true">
          {feature.name === "source" ? (
            <div className="feature-banner-5-frame">
              <FeatureBanner5
                play={motion !== "idle"}
                direction={direction}
              />
            </div>
          ) : (
            <img src={"/assets/" + feature.artwork} alt="" loading="lazy" />
          )}
        </div>
      </div>
    </section>
  )
}
