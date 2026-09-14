import { useCallback, useEffect, useRef, useState } from "react"
import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import { ConlocaIcon } from "@conloca-design-system/components/conloca-icon"
import CopyIcon from "@conloca-design-system/icons/copy-02.svg?react"
import { cn } from "@/lib/utils"
import type {
  HowItWorksPageContent,
  HowItWorksStep,
  PackageManager,
} from "@/how-it-works-page-content"

export interface HowItWorksPageSectionsProps {
  content: HowItWorksPageContent
}

function StepScrollButton({
  index,
  onSelect,
  step,
}: {
  index: number
  onSelect: (index: number) => void
  step: HowItWorksStep
}) {
  const handleClick = useCallback(() => onSelect(index), [index, onSelect])
  return (
    <button
      aria-labelledby={
        "hiw-step-" + step.number + "-number hiw-step-" + step.number + "-title"
      }
      className="hiw-step__trigger"
      onClick={handleClick}
      type="button"
    />
  )
}

function PackageManagerTab({
  active,
  manager,
  onSelect,
}: {
  active: boolean
  manager: PackageManager
  onSelect: (manager: PackageManager) => void
}) {
  const handleClick = useCallback(() => onSelect(manager), [manager, onSelect])
  return (
    <button
      aria-pressed={active}
      className={cn("hiw-terminal__tab", active && "hiw-terminal__tab--active")}
      onClick={handleClick}
      type="button"
    >
      {manager}
    </button>
  )
}

export function HowItWorksPageSections({
  content,
}: HowItWorksPageSectionsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>(
    content.cta.packageManagers[0],
  )
  const command = content.cta.commands[packageManager]

  const copyCommand = useCallback(() => {
    void navigator.clipboard?.writeText(command)
  }, [command])

  const flowTrackRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const track = flowTrackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1)
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      setActiveStep((previous) => {
        const next = Math.min(
          Math.floor(progress * content.steps.items.length),
          content.steps.items.length - 1,
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
  }, [content.steps.items.length])
  const scrollToStep = useCallback(
    (index: number) => {
      const track = flowTrackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      const reduceMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false
      window.scrollTo({
        behavior: reduceMotion ? "auto" : "smooth",
        top:
          window.scrollY +
          rect.top +
          (scrollable * index) / content.steps.items.length +
          1,
      })
    },
    [content.steps.items.length],
  )

  return (
    <>
      <section className="hiw-hero" aria-labelledby="hiw-hero-heading">
        <p className="hiw-hero__eyebrow">{content.hero.eyebrow}</p>
        <div className="hiw-hero__grid">
          <h1 className="hiw-hero__heading" id="hiw-hero-heading">
            {content.hero.heading}
          </h1>
          <p className="hiw-hero__description">{content.hero.description}</p>
        </div>
      </section>

      <section
        aria-label={content.steps.label}
        className="hiw-flow"
        ref={flowTrackRef}
      >
        <div className="hiw-flow__pin">
          <ol className="hiw-steps">
            <div
              aria-hidden="true"
              className="hiw-steps__progress"
              ref={progressRef}
            />
            {content.steps.items.map((step, index) => (
              <li
                className={cn(
                  "hiw-step",
                  index === activeStep && "hiw-step--active",
                )}
                key={step.number}
              >
                <span
                  className="hiw-step__number"
                  id={"hiw-step-" + step.number + "-number"}
                >
                  {step.number}
                </span>
                <div className="hiw-step__body">
                  <h2
                    className="hiw-step__title"
                    id={"hiw-step-" + step.number + "-title"}
                  >
                    {step.title}
                  </h2>
                  <p className="hiw-step__description">{step.description}</p>
                </div>
                <StepScrollButton
                  index={index}
                  onSelect={scrollToStep}
                  step={step}
                />
              </li>
            ))}
          </ol>
          <div className="hiw-showcase" data-active-step={activeStep}>
            <img
              alt={content.steps.mockAlt}
              className="hiw-showcase__mock"
              height="1597"
              src="/assets/how-it-works-editor-mock.png"
              width="2718"
            />
          </div>
        </div>
      </section>


      <section className="hiw-layers" aria-labelledby="hiw-layers-heading">
        <div className="hiw-layers__stage">
          <div className="hiw-layers__intro">
            <h2 className="hiw-layers__heading" id="hiw-layers-heading">
              {content.layers.heading}
            </h2>
            <p className="hiw-layers__description">
              {content.layers.description}
            </p>
          </div>
          <div className="hiw-layers__diagram">
            <img
              alt={content.layers.diagramAlt}
              className="hiw-layers__diagram-image"
              height="714"
              src="/assets/how-it-works-layers-diagram.png"
              width="2205"
            />
          </div>
        </div>
        <ol className="hiw-layers__list">
          {content.layers.items.map((layer) => (
            <li className="hiw-layer" key={layer.label}>
              <span className="hiw-layer__label">{layer.label}</span>
              <div className="hiw-layer__body">
                <p className="hiw-layer__description">{layer.description}</p>
                <a
                  className={conlocaButtonVariants({
                    size: "small",
                    variant: "link",
                  })}
                  data-slot="conloca-button"
                  href={layer.action.url}
                >
                  {layer.action.label}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="hiw-bento" aria-label={content.bento.label}>
        <div className="hiw-bento__grid">
          {content.bento.cards.map((card) => (
            <article className="hiw-bento-card" key={card.title}>
              <ConlocaIcon
                className="hiw-bento-card__icon"
                name={card.icon}
                size={32}
                {...(card.iconTint === "olive"
                  ? { color: "var(--color-olive-700)" }
                  : {})}
              />
              <div className="hiw-bento-card__body">
                <h3 className="hiw-bento-card__title">{card.title}</h3>
                <p className="hiw-bento-card__description">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
          <h2 className="hiw-bento__heading">{content.bento.heading}</h2>
        </div>
      </section>

      <section className="hiw-cta" aria-labelledby="hiw-cta-heading">
        <div className="hiw-cta__card">
          <div className="hiw-cta__copy">
            <h2 className="hiw-cta__heading" id="hiw-cta-heading">
              {content.cta.heading}
            </h2>
            <p className="hiw-cta__description">{content.cta.description}</p>
          </div>
          <div className="hiw-terminal">
            <div className="hiw-terminal__header">
              <div
                aria-label={content.cta.packageManagerLabel}
                className="hiw-terminal__tabs"
                role="group"
              >
                {content.cta.packageManagers.map((manager) => (
                  <PackageManagerTab
                    active={manager === packageManager}
                    key={manager}
                    manager={manager}
                    onSelect={setPackageManager}
                  />
                ))}
              </div>
              <button
                className="hiw-terminal__copy"
                onClick={copyCommand}
                type="button"
              >
                <CopyIcon aria-hidden="true" className="hiw-terminal__copy-icon" />
                {content.cta.copyLabel}
              </button>
            </div>
            <p className="hiw-terminal__command">
              <span className="hiw-terminal__prompt">$</span>
              <code>{command}</code>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
