import { BentoLottie } from "@/sections/bento-lottie"
import type { CapabilitiesContent } from "@/homepage-content"

export interface CapabilitiesSectionProps {
  content: CapabilitiesContent
}

const bentoLotties: Record<string, string> = {
  publishing: "/assets/Lotties/bento-01.lottie",
  git: "/assets/Lotties/bento-02.lottie",
  markdown: "/assets/Lotties/bento-03.lottie",
  media: "/assets/Lotties/bento-04.lottie",
  data: "/assets/Lotties/bento-05.lottie",
  fragments: "/assets/Lotties/bento-06.lottie",
  history: "/assets/Lotties/bento-07.lottie",
}
export function CapabilitiesSection({ content }: CapabilitiesSectionProps) {
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
      <div className="bento-grid">
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
            <BentoLottie
              src={bentoLotties[capability.name]}
              {...(capability.name === "fragments" ? { startFrame: 1 } : {})}
            />
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
