export interface HowItWorksHeroContent {
  eyebrow: string
  heading: string
  description: string
}

export interface HowItWorksHeroProps {
  content: HowItWorksHeroContent
}

// Static headline section.
export function HowItWorksHero({ content }: HowItWorksHeroProps) {
  return (
    <section className="hiw-hero" aria-labelledby="hiw-hero-heading">
      <p className="hiw-hero__eyebrow">{content.eyebrow}</p>
      <div className="hiw-hero__grid">
        <h1 className="hiw-hero__heading" id="hiw-hero-heading">
          {content.heading}
        </h1>
        <p className="hiw-hero__description">{content.description}</p>
      </div>
    </section>
  )
}
