import type {
  BlogArticle,
  BlogDescription,
  BlogListingContent,
} from "@/blog-content"

export interface BlogListingSectionProps {
  content: BlogListingContent
}

function Description({ content }: { content: BlogDescription }) {
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

function ArticleMetadata({ article }: { article: BlogArticle }) {
  return (
    <>
      <p className="blog-card__metadata blog-card__metadata--wide">
        <span>{article.readTime}</span>
        <span>{article.date}</span>
      </p>
      <p className="blog-card__metadata blog-card__metadata--compact">
        <span>{article.readTime}</span>
        <span aria-hidden="true">/</span>
        <span>{article.date}</span>
      </p>
    </>
  )
}

function BlogArticleCard({ article }: { article: BlogArticle }) {
  return (
    <article className={`blog-card blog-card--${article.layout}`}>
      <a className="blog-card__link" href={article.url}>
        <div className="blog-card__image-wrap">
          <img
            alt=""
            className="blog-card__image"
            height={article.image.height}
            src={article.image.src}
            width={article.image.width}
          />
        </div>
        <div className="blog-card__primary">
          <ArticleMetadata article={article} />
          <h2 className="blog-card__title">{article.title}</h2>
        </div>
        <div className="blog-card__secondary">
          <p className="blog-card__description blog-card__description--wide">
            <Description content={article.description} />
          </p>
          <p className="blog-card__description blog-card__description--compact">
            <Description
              content={article.compactDescription ?? article.description}
            />
          </p>
        </div>
      </a>
    </article>
  )
}

export function BlogListingSection({ content }: BlogListingSectionProps) {
  return (
    <section
      aria-label={content.navigationLabel}
      className="blog-listing"
    >
      {content.articles.map((article) => (
        <BlogArticleCard article={article} key={article.id} />
      ))}
    </section>
  )
}
