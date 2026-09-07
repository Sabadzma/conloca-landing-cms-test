import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import type {
  ArticleBenefit,
  ArticleBodySection,
  ArticleDescription,
  ArticlePageContent,
  ArticleRelatedStory,
} from "@/article-page-content"

export interface ArticlePageSectionsProps {
  content: ArticlePageContent
}

function Description({ content }: { content: ArticleDescription }) {
  if (content.emphasisFirst) {
    return (
      <>
        <strong>{content.emphasis}</strong>
        {content.supporting}
      </>
    )
  }

  return (
    <>
      {content.supporting}
      <strong>{content.emphasis}</strong>
    </>
  )
}

function ArticleBenefits({ items }: { items: readonly ArticleBenefit[] }) {
  return (
    <dl className="article-benefits">
      {items.map((item) => (
        <div className="article-benefit" key={item.title}>
          <dt>{item.title}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}

function ArticleSection({ section }: { section: ArticleBodySection }) {
  return (
    <section className="article-block" id={section.id}>
      <p className="article-block__label">{section.label}</p>
      <h2>{section.title}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.benefits ? <ArticleBenefits items={section.benefits} /> : null}
      {section.quote ? (
        <p className="article-block__quote">{section.quote}</p>
      ) : null}
    </section>
  )
}

function RelatedStoryCard({ story }: { story: ArticleRelatedStory }) {
  return (
    <article
      className={
        "article-related-card" +
        (story.imageFirst ? " article-related-card--image-first" : "")
      }
    >
      <a className="article-related-card__link" href={story.url}>
        <img
          alt={story.image.alt}
          className="article-related-card__image"
          height={story.image.height}
          src={story.image.src}
          width={story.image.width}
        />
        <div className="article-related-card__copy">
          <p className="article-related-card__meta article-related-card__meta--wide">
            <span>{story.readTime}</span>
            <span>{story.date}</span>
          </p>
          <p className="article-related-card__meta article-related-card__meta--compact">
            <span>{story.readTime}</span>
            <span aria-hidden="true">/</span>
            <span>{story.date}</span>
          </p>
          <h3>{story.title}</h3>
        </div>
        <p className="article-related-card__description article-related-card__description--wide">
          <Description content={story.description} />
        </p>
        <p className="article-related-card__description article-related-card__description--compact">
          <Description content={story.compactDescription} />
        </p>
      </a>
    </article>
  )
}

export function ArticlePageSections({ content }: ArticlePageSectionsProps) {
  return (
    <>
      <section className="article-hero" aria-labelledby="article-heading">
        <div className="article-hero__meta">
          <p className="article-hero__date">{content.hero.date}</p>
          <nav aria-label="Breadcrumb" className="article-hero__breadcrumbs">
            <ol>
              {content.hero.breadcrumbs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </nav>
        </div>
        <h1 id="article-heading">{content.hero.title}</h1>
        <div className="article-hero__footer">
          <p className="article-hero__description">{content.hero.description}</p>
          <div className="article-hero__byline">
            <div className="article-hero__author">
              <p className="article-hero__author-label">
                {content.hero.authorLabel}
              </p>
              <p className="article-hero__author-name">{content.hero.author}</p>
            </div>
            <p className="article-hero__date-compact">{content.hero.date}</p>
          </div>
        </div>
      </section>

      <figure className="article-cover">
        <div className="article-cover__frame">
          <img
            alt={content.cover.alt}
            height={content.cover.height}
            src={content.cover.src}
            width={content.cover.width}
          />
        </div>
      </figure>

      <div className="article-body">
        <nav aria-label={content.body.tocLabel} className="article-toc">
          <p className="article-toc__label">{content.body.tocLabel}</p>
          <ol>
            {content.body.sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{section.tocTitle}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article aria-labelledby="article-heading" className="article-content">
          <div className="article-intro">
            {content.body.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="article-practice">
            <h2>{content.body.practiceHeading}</h2>
            <ol className="article-steps">
              {content.body.steps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="article-practice-intro">{content.body.practiceIntro}</p>

          {content.body.sections.map((section) => (
            <ArticleSection key={section.id} section={section} />
          ))}

          <p className="article-closing">{content.body.closing}</p>
        </article>
      </div>

      <section
        aria-labelledby="article-related-heading"
        className="article-related"
      >
        <div className="article-related__header">
          <h2 id="article-related-heading">{content.related.heading}</h2>
          <a
            className={conlocaButtonVariants({
              size: "default",
              variant: "link",
            })}
            data-slot="conloca-button"
            href={content.related.moreUrl}
          >
            {content.related.moreLabel}
          </a>
        </div>
        <div className="article-related__stories">
          {content.related.stories.map((story) => (
            <RelatedStoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </>
  )
}
