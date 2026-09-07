import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
  type MouseEvent,
} from "react"
import { ConlocaHeader } from "@conloca-design-system/components/conloca-header"
import { ConlocaFooter } from "@conloca-design-system/components/conloca-footer"
import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import { ConlocaCarouselProgress } from "@conloca-design-system/components/conloca-carousel-progress"
import {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
} from "@conloca-design-system/components/conloca-dialog"
import CheckIcon from "@conloca-design-system/icons/check-01.svg?react"
import {
  audienceOptions,
  capabilities,
  features,
  heroHeadings,
  heroMessages,
  navigation,
  plans,
  type Audience,
} from "./homepage-content"
import { cn } from "./lib/utils"
import { useCarouselPlayback } from "./use-carousel-playback"
import "./homepage.css"

const primaryHeaderAction = { label: "Get started", url: "/" }
const secondaryHeaderAction = { label: "Try editor", url: "/" }
const footerAction = { label: "Get started", url: "/" }
const billingOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Annual", value: "annual" },
]

function HomeLink({
  children,
  className,
  variant = "primary",
  size = "default",
}: {
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary"
  size?: "default" | "small"
}) {
  return (
    <a
      href="/"
      data-slot="conloca-button"
      className={cn(conlocaButtonVariants({ size, variant }), className)}
    >
      {children}
    </a>
  )
}

function HeroCarousel({ audience }: { audience: Audience }) {
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
  const messages = heroMessages[audience]
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
      aria-label="How Conloca works"
      data-running={running}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onFocusCapture={startFocus}
      onBlurCapture={handleBlur}
    >
      <div className="hero-indicator-space">
        <div className="hero-indicators" aria-label="Choose a message">
          {messages.map((item, index) => (
            <button
              key={item[0]}
              type="button"
              className="hero-indicator-button"
              aria-label={"Show message " + (index + 1)}
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
        {paused ? "Play messages" : "Pause messages"}
      </button>
    </div>
  )
}

export function App() {
  const [audience, setAudience] = useState<Audience>("developers")
  const [billing, setBilling] = useState("monthly")
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
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ConlocaHeader
        menuItems={navigation}
        primaryButton={primaryHeaderAction}
        secondaryButton={secondaryHeaderAction}
      />
      <main id="main-content" data-audience={audience}>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-main-copy">
            <div className="hero-heading-group">
              <ConlocaSegmentedControl
                className="hero-audience"
                aria-label="Choose your role"
                options={audienceOptions}
                value={audience}
                onValueChange={selectAudience}
              />
              <h1 id="hero-heading">{heroHeadings[audience]}</h1>
              <div className="astro-badge">
                <img
                  src="/assets/astro-mark.svg"
                  alt=""
                  width="14"
                  height="17"
                />
                <span>Built for Astro</span>
              </div>
            </div>
            <div className="hero-actions">
              <HomeLink>Get started</HomeLink>
              <HomeLink variant="secondary">Try Demo</HomeLink>
            </div>
            <div className="hero-visual">
              <div className="hero-video-background">
                <button
                  className="hero-video"
                  type="button"
                  aria-label="Play Conloca demo video"
                  onClick={openVideo}
                >
                  <img
                    className="hero-video-poster"
                    src="/assets/demo-poster.png"
                    alt="Conloca dashboard preview"
                    width="4096"
                    height="2731"
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
          <div className="hero-description">
            <HeroCarousel key={audience} audience={audience} />
          </div>
        </section>
        <div className="features" id="how-it-works">
          {features.map((feature) => (
            <section
              key={feature.name}
              className={"feature feature-" + feature.name}
              aria-labelledby={"feature-" + feature.name}
            >
              <div className="feature-audience">
                <ConlocaSegmentedControl
                  aria-label={"Choose your role for " + feature[audience].title}
                  options={audienceOptions}
                  value={audience}
                  onValueChange={selectAudience}
                  transparent
                />
              </div>
              <div className="feature-content">
                <div className="feature-copy">
                  <div className="feature-text">
                    <h2 id={"feature-" + feature.name}>
                      {feature[audience].title}
                    </h2>
                    <p>{feature[audience].description}</p>
                  </div>
                  <div className="feature-actions">
                    <HomeLink>Get started</HomeLink>
                    <HomeLink variant="secondary">Read docs</HomeLink>
                  </div>
                </div>
                <div className="feature-artwork" aria-hidden="true">
                  <img
                    src={"/assets/" + feature.artwork}
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
        <section
          className="capabilities"
          aria-labelledby="capabilities-heading"
        >
          <div className="capabilities-heading">
            <div className="capabilities-title-art">
              <h2 id="capabilities-heading">
                Everything you need
                <br />
                <span>nothing you don't</span>
              </h2>
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet="/assets/decoration-git-mobile.svg"
                />
                <img
                  className="decoration decoration-git"
                  src="/assets/decoration-git.svg"
                  alt=""
                  loading="lazy"
                />
              </picture>
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet="/assets/decoration-astro-mobile.svg"
                />
                <img
                  className="decoration decoration-astro"
                  src="/assets/decoration-astro.svg"
                  alt=""
                  loading="lazy"
                />
              </picture>
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet="/assets/decoration-published-mobile.svg"
                />
                <img
                  className="decoration decoration-published"
                  src="/assets/decoration-published.svg"
                  alt=""
                  loading="lazy"
                />
              </picture>
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet="/assets/decoration-file-mobile.svg"
                />
                <img
                  className="decoration decoration-file"
                  src="/assets/decoration-file.svg"
                  alt=""
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
          <div className="bento-grid">
            {capabilities.map((capability) => (
              <article
                className={"bento-card bento-" + capability.name}
                key={capability.name}
              >
                <picture>
                  {["publishing", "git", "fragments"].includes(
                    capability.name,
                  ) && (
                    <source
                      media={
                        capability.name === "git"
                          ? "(max-width: 1280px)"
                          : "(max-width: 1023px)"
                      }
                      srcSet={
                        "/assets/bento-" + capability.name + "-compact.svg"
                      }
                    />
                  )}
                  <img
                    className="bento-artwork"
                    src={
                      "/assets/bento-" +
                      capability.name +
                      (capability.name === "markdown" ? ".webp" : ".svg")
                    }
                    alt=""
                    loading="lazy"
                  />
                </picture>
                <div className="bento-scrim" aria-hidden="true" />
                <div className="bento-copy">
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="pricing"
          id="pricing"
          aria-labelledby="pricing-heading"
        >
          <div className="pricing-intro">
            <h2 id="pricing-heading">Choose a plan that fits you the best</h2>
          </div>
          <ConlocaSegmentedControl
            className="pricing-billing"
            aria-label="Billing interval"
            options={billingOptions}
            value={billing}
            onValueChange={setBilling}
          />
          <div className="pricing-cards">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  "plan-card" + (plan.name === "Pro" ? " plan-pro" : "")
                }
              >
                <div className="plan-summary">
                  <div className="plan-summary-content">
                    <div className="plan-name">
                      <h3>{plan.name}</h3>
                      {plan.name === "Pro" && (
                        <span className="plan-badge">Best value</span>
                      )}
                    </div>
                    <div className="plan-price-description">
                      <p className="plan-price">
                        <strong>
                          {"$" + plan.price * (billing === "annual" ? 12 : 1)}
                        </strong>
                        <span>
                          {billing === "annual" ? "/ Year" : "/ Month"}
                        </span>
                      </p>
                      <p className="plan-description">{plan.description}</p>
                    </div>
                  </div>
                  <HomeLink
                    variant={plan.name === "Pro" ? "primary" : "secondary"}
                    className="h-[44px] w-full rounded-[12px] font-bold"
                  >
                    {"Choose " + plan.name.toLowerCase()}
                  </HomeLink>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckIcon aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <HomeLink variant="secondary" className="pricing-compare">
            Compare plans
          </HomeLink>
        </section>
      </main>
      <ConlocaFooter
        action={footerAction}
        navigationItems={navigation}
      />
      <ConlocaDialog open={videoOpen} onOpenChange={setVideoOpen}>
        <ConlocaDialogContent
          className="video-dialog"
          closeLabel="Close demo video"
          finalFocus={lastVideoTrigger}
        >
          <ConlocaDialogTitle className="sr-only">
            Conloca demo video
          </ConlocaDialogTitle>
          {/* YouTube needs scripts and its origin for playback; it is cross-origin to this site. */}
          {/* oxlint-disable react/iframe-missing-sandbox */}
          {videoOpen && (
            <iframe
              title="Conloca demo video"
              src="https://www.youtube.com/embed/zNGWdTLWktY?start=48&autoplay=1&rel=0"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </ConlocaDialogContent>
      </ConlocaDialog>
    </>
  )
}
