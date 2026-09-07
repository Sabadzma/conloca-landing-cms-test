import type { BlogHeroContent } from "@/blog-content"

export interface BlogHeroSectionProps {
  content: BlogHeroContent
}

function Breadcrumbs({ items }: { items: readonly string[] }) {
  return (
    <p className="blog-hero__breadcrumbs">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </p>
  )
}

export function BlogHeroSection({ content }: BlogHeroSectionProps) {
  return (
    <section className="blog-hero" aria-labelledby="blog-heading">
      <div className="blog-hero__topline">
        <p className="blog-hero__dispatch">
          <span aria-hidden="true" />
          {content.dispatchLabel}
        </p>
        <div className="blog-hero__breadcrumbs-large">
          <Breadcrumbs items={content.largeBreadcrumbs} />
        </div>
        <div className="blog-hero__breadcrumbs-compact">
          <Breadcrumbs items={content.compactBreadcrumbs} />
        </div>
      </div>

      <div className="blog-hero__copy">
        <h1 id="blog-heading">
          <span className="blog-hero__heading-wide">{content.heading}</span>
          <span className="blog-hero__heading-mobile">
            {content.mobileHeading}
          </span>
        </h1>
        <p className="blog-hero__description">{content.description}</p>
      </div>
    </section>
  )
}
