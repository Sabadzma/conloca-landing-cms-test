import { useEffect, useRef } from "react"

import type { CapabilitiesContent } from "@/homepage-content"

export interface CapabilitiesSectionProps {
  content: CapabilitiesContent
}
export function CapabilitiesSection({ content }: CapabilitiesSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    grid.dataset.armed = ""
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          grid.dataset.revealed = ""
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])
  return (
    <section className="capabilities" aria-labelledby="capabilities-heading">
      <div className="capabilities-heading">
        <div className="capabilities-title-art">
          <h2 id="capabilities-heading">
            {content.heading}
            <br />
            <span>{content.subheading}</span>
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
      <div className="bento-grid" ref={gridRef}>
        {content.items.map((capability) => (
          <article
            className={"bento-card bento-" + capability.name}
            key={capability.name}
          >
            <picture>
              {["publishing", "git", "fragments"].includes(capability.name) && (
                <source
                  media={
                    capability.name === "git"
                      ? "(max-width: 1280px)"
                      : "(max-width: 1023px)"
                  }
                  srcSet={"/assets/bento-" + capability.name + "-compact.svg"}
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
  )
}
