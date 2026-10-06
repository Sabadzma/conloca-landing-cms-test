import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface HowItWorksStep {
  number: string
  title: string
  description: string
}

export interface HowItWorksStepsContent {
  label: string
  items: readonly HowItWorksStep[]
}

export interface HowItWorksStepsProps {
  content: HowItWorksStepsContent
}

type VisualWindowName = "mdx" | "json" | "editor"

function VisualWindow({ name }: { name: VisualWindowName }) {
  return (
    <picture className="hiw-visual__picture">
      <source
        media="(min-width: 1281px)"
        srcSet={`/assets/how-it-works-visual-${name}-desktop.png`}
      />
      <source
        media="(min-width: 1024px)"
        srcSet={`/assets/how-it-works-visual-${name}-tablet.png`}
      />
      <source
        media="(min-width: 640px)"
        srcSet={`/assets/how-it-works-visual-${name}-small.png`}
      />
      <img
        alt=""
        className={cn("hiw-visual__window", `hiw-visual__window--${name}`)}
        src={`/assets/how-it-works-visual-${name}-mobile.png`}
      />
    </picture>
  )
}

// Steps list plus the layered visual. The IntersectionObserver entrance is
// scoped to this block, so it needs client hydration.
export function HowItWorksSteps({ content }: HowItWorksStepsProps) {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visual = visualRef.current
    if (!visual) return
    if (typeof IntersectionObserver !== "function") {
      visual.classList.add("hiw-visual--entered")
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.intersectionRatio >= 1)) {
          visual.classList.add("hiw-visual--entered")
          observer.disconnect()
        }
      },
      { threshold: 1 },
    )
    observer.observe(visual)
    return () => observer.disconnect()
  }, [])

  return (
    <section aria-label={content.label} className="hiw-steps-section">
      <ol className="hiw-steps">
        {content.items.map((step) => (
          <li className="hiw-step" key={step.number}>
            <span className="hiw-step__number">{step.number}</span>
            <div className="hiw-step__body">
              <h2 className="hiw-step__title">{step.title}</h2>
              <p className="hiw-step__description">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="hiw-visual" ref={visualRef}>
        <VisualWindow name="mdx" />
        <VisualWindow name="json" />
        <VisualWindow name="editor" />
      </div>
    </section>
  )
}
