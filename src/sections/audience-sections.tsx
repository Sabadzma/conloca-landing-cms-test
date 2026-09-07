import { useCallback, useRef, useState, type MouseEvent } from "react"
import {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
} from "@conloca-design-system/components/conloca-dialog"
import type { Audience, AudienceContent } from "@/homepage-content"
import { HeroSection } from "./hero-section"
import { FeatureSection } from "./feature-section"

export interface AudienceSectionsProps {
  content: AudienceContent
}
export function AudienceSections({ content }: AudienceSectionsProps) {
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

  return (
    <div className="audience-sections" data-audience={audience}>
      <HeroSection
        content={content.hero}
        audience={audience}
        options={content.options}
        onAudienceChange={selectAudience}
        onOpenVideo={openVideo}
      />
      <div className="features" id="how-it-works">
        {content.features.map((feature) => (
          <FeatureSection
            key={feature.name}
            feature={feature}
            controls={content.featureControls}
            audience={audience}
            options={content.options}
            onAudienceChange={selectAudience}
          />
        ))}
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
