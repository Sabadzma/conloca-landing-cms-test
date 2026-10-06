import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import type { ContentLink } from "@/lib/content"

export interface HowItWorksLayer {
  label: string
  description: string
  action: ContentLink
}

export interface HowItWorksLayersContent {
  heading: string
  description: string
  items: readonly HowItWorksLayer[]
}

export interface HowItWorksLayersProps {
  content: HowItWorksLayersContent
}

// Static "three layers" section.
export function HowItWorksLayers({ content }: HowItWorksLayersProps) {
  return (
    <section className="hiw-layers" aria-labelledby="hiw-layers-heading">
      <div className="hiw-layers__intro">
        <h2 className="hiw-layers__heading" id="hiw-layers-heading">
          {content.heading}
        </h2>
        <p className="hiw-layers__description">{content.description}</p>
      </div>
      <ol className="hiw-layers__list">
        {content.items.map((layer) => (
          <li className="hiw-layer" key={layer.label}>
            <span className="hiw-layer__label">{layer.label}</span>
            <div className="hiw-layer__body">
              <p className="hiw-layer__title">{layer.description}</p>
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
  )
}
