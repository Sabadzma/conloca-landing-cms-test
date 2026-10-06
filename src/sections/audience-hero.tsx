import { useCallback, useRef, useState, type MouseEvent } from "react"
import {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
} from "@conloca-design-system/components/conloca-dialog"
import type { ContentLink } from "@/lib/content"
import { useAudience, type Audience, type AudienceOption } from "./audience"
import { HeroSection } from "./hero-section"

export type HeroMessages = readonly [
  readonly [string, string],
  ...(readonly [string, string])[],
]

export interface HeroContent {
  headings: Record<Audience, string>
  messages: Record<Audience, HeroMessages>
  audienceLabel: string
  badge: string
  primaryAction: ContentLink
  secondaryAction: ContentLink
  carousel: {
    label: string
    chooseLabel: string
    showLabel: string
    playLabel: string
    pauseLabel: string
  }
  video: {
    title: string
    playLabel: string
    closeLabel: string
    url: string
    poster: { src: string; alt: string; width: number; height: number }
  }
}

export interface AudienceHeroProps {
  content: HeroContent
  options: readonly AudienceOption[]
}

// Homepage hero with the demo-video dialog. The audience state comes from the
// shared store so this block stays in sync with AudienceFeatures when both are
// hydrated independently on the same page. The wrapper carries the audience
// CSS variables (homepage.css scopes background artwork to [data-audience]).
export function AudienceHero({ content, options }: AudienceHeroProps) {
  const [audience, setAudience] = useAudience()
  const [videoOpen, setVideoOpen] = useState(false)
  const lastVideoTrigger = useRef<HTMLElement | null>(null)
  const openVideo = useCallback((event: MouseEvent<HTMLElement>) => {
    lastVideoTrigger.current = event.currentTarget
    setVideoOpen(true)
  }, [])

  return (
    <div className="audience-sections" data-audience={audience}>
      <HeroSection
        content={content}
        audience={audience}
        options={options}
        onAudienceChange={setAudience}
        onOpenVideo={openVideo}
      />
      <ConlocaDialog open={videoOpen} onOpenChange={setVideoOpen}>
        <ConlocaDialogContent
          className="video-dialog"
          closeLabel={content.video.closeLabel}
          finalFocus={lastVideoTrigger}
        >
          <ConlocaDialogTitle className="sr-only">
            {content.video.title}
          </ConlocaDialogTitle>
          {/* YouTube needs scripts and its origin for playback; it is cross-origin to this site. */}
          {/* oxlint-disable react/iframe-missing-sandbox */}
          {videoOpen && (
            <iframe
              title={content.video.title}
              src={content.video.url}
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
