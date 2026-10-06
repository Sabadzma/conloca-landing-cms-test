import type { AudienceControlProps } from "./audience-controls"
import type { MouseEventHandler } from "react"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import type { HeroContent } from "./audience-hero"
import { SectionLink } from "./section-link"
import { HeroCarousel } from "./hero-carousel"

export interface HeroSectionProps extends AudienceControlProps {
  content: HeroContent
  onOpenVideo: MouseEventHandler<HTMLElement>
}

export function HeroSection({
  content,
  audience,
  options,
  onAudienceChange,
  onOpenVideo,
}: HeroSectionProps) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-main-copy">
        <div className="hero-heading-group">
          <ConlocaSegmentedControl
            className="hero-audience"
            aria-label={content.audienceLabel}
            options={options}
            value={audience}
            onValueChange={onAudienceChange}
          />
          <h1 id="hero-heading">{content.headings[audience]}</h1>
          <div className="astro-badge">
            <img src="/assets/astro-mark.svg" alt="" width="14" height="17" />
            <span>{content.badge}</span>
          </div>
        </div>
        <div className="hero-actions">
          <SectionLink href={content.primaryAction.url}>
            {content.primaryAction.label}
          </SectionLink>
          <SectionLink variant="secondary" href={content.secondaryAction.url}>
            {content.secondaryAction.label}
          </SectionLink>
        </div>
        <div className="hero-visual">
          <div className="hero-video-background">
            <div className="hero-video-clip">
              <button
                className="hero-video"
                type="button"
                aria-label={content.video.playLabel}
                onClick={onOpenVideo}
              >
                <img
                  className="hero-video-poster"
                  src={content.video.poster.src}
                  alt={content.video.poster.alt}
                  width={content.video.poster.width}
                  height={content.video.poster.height}
                  fetchPriority="high"
                />
                <span className="video-play">
                  <img
                    src="/assets/play-mark.svg"
                    alt=""
                    width="24"
                    height="24"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-description">
        <HeroCarousel
          key={audience}
          messages={content.messages[audience]}
          labels={content.carousel}
        />
      </div>
    </section>
  )
}
