import type { AudienceControlProps } from "./audience-controls"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import type { FeatureContent, FeatureControls } from "@/homepage-content"
import { SectionLink } from "./section-link"

export interface FeatureSectionProps extends AudienceControlProps {
  feature: FeatureContent
  controls: FeatureControls
}
export function FeatureSection({
  feature,
  controls,
  audience,
  options,
  onAudienceChange,
}: FeatureSectionProps) {
  return (
    <section
      className={"feature feature-" + feature.name}
      aria-labelledby={"feature-" + feature.name}
    >
      <div className="feature-audience">
        <ConlocaSegmentedControl
          aria-label={controls.audienceLabelPrefix + feature[audience].title}
          options={options}
          value={audience}
          onValueChange={onAudienceChange}
          transparent
        />
      </div>
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
          <img src={"/assets/" + feature.artwork} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
