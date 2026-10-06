import type { ComponentConfig } from "@puckeditor/core"
import {
  HowItWorksHero as HowItWorksHeroView,
  type HowItWorksHeroContent,
} from "@/sections/how-it-works-hero"

// Puck-storable props = the hero content shape directly.
export type HowItWorksHeroBlockProps = HowItWorksHeroContent

export function mapHowItWorksHeroProps(
  props: HowItWorksHeroBlockProps,
): HowItWorksHeroContent {
  return props
}

export const HowItWorksHeroBlock: ComponentConfig<HowItWorksHeroBlockProps> = {
  label: "How it works hero",
  fields: {
    eyebrow: { type: "text" },
    heading: { type: "text" },
    description: { type: "textarea" },
  },
  defaultProps: {
    eyebrow: "How it works",
    heading: "Your repository is the CMS",
    description:
      "Developers build the components. Editors compose them visually. Conloca stores the result as files in your Git repository, and Astro renders those same files into your website. No content database. No hosted CMS API between your site and its content.",
  },
  render: (props) => (
    <HowItWorksHeroView content={mapHowItWorksHeroProps(props)} />
  ),
}
