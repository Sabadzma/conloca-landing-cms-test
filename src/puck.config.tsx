import type { Config } from "@puckeditor/core"
import {
  HeroSection,
  type HeroSectionBlockProps,
} from "./puck/blocks/hero-section"
import {
  FeaturesSection,
  type FeaturesSectionBlockProps,
} from "./puck/blocks/features-section"
import {
  CapabilitiesSection,
  type CapabilitiesSectionBlockProps,
} from "./puck/blocks/capabilities-section"
import {
  PricingSection,
  type PricingSectionBlockProps,
} from "./puck/blocks/pricing-section"
import {
  PricingPageHero,
  type PricingPageHeroBlockProps,
} from "./puck/blocks/pricing-page-hero"
import {
  PricingPagePlans,
  type PricingPagePlansBlockProps,
} from "./puck/blocks/pricing-page-plans"
import {
  PricingPageComparison,
  type PricingPageComparisonBlockProps,
} from "./puck/blocks/pricing-page-comparison"
import {
  PricingPageAssistantBlock,
  type PricingPageAssistantBlockProps,
} from "./puck/blocks/pricing-page-assistant-block"
import {
  HowItWorksHeroBlock,
  type HowItWorksHeroBlockProps,
} from "./puck/blocks/how-it-works-hero-block"
import {
  HowItWorksSteps,
  type HowItWorksStepsBlockProps,
} from "./puck/blocks/how-it-works-steps"
import {
  HowItWorksLayersBlock,
  type HowItWorksLayersBlockProps,
} from "./puck/blocks/how-it-works-layers-block"
import {
  HowItWorksBentoBlock,
  type HowItWorksBentoBlockProps,
} from "./puck/blocks/how-it-works-bento-block"
import {
  HowItWorksCta,
  type HowItWorksCtaBlockProps,
} from "./puck/blocks/how-it-works-cta"
import {
  TermsPageSectionsBlock,
  type TermsPageSectionsBlockProps,
} from "./puck/blocks/terms-page-sections-block"
import {
  BlogHeroSectionBlock,
  type BlogHeroSectionBlockProps,
} from "./puck/blocks/blog-hero-section-block"
import {
  BlogListingSectionBlock,
  type BlogListingSectionBlockProps,
} from "./puck/blocks/blog-listing-section-block"
import {
  ArticlePageSectionsBlock,
  type ArticlePageSectionsBlockProps,
} from "./puck/blocks/article-page-sections-block"

// Block keys are stored in content files — never rename them.
export interface PuckComponents {
  HeroSection: HeroSectionBlockProps
  FeaturesSection: FeaturesSectionBlockProps
  CapabilitiesSection: CapabilitiesSectionBlockProps
  PricingSection: PricingSectionBlockProps
  PricingPageHero: PricingPageHeroBlockProps
  PricingPagePlans: PricingPagePlansBlockProps
  PricingPageComparison: PricingPageComparisonBlockProps
  PricingPageAssistant: PricingPageAssistantBlockProps
  HowItWorksHero: HowItWorksHeroBlockProps
  HowItWorksSteps: HowItWorksStepsBlockProps
  HowItWorksLayers: HowItWorksLayersBlockProps
  HowItWorksBento: HowItWorksBentoBlockProps
  HowItWorksCta: HowItWorksCtaBlockProps
  TermsPageSections: TermsPageSectionsBlockProps
  BlogHeroSection: BlogHeroSectionBlockProps
  BlogListingSection: BlogListingSectionBlockProps
  ArticlePageSections: ArticlePageSectionsBlockProps
}

const config: Config<PuckComponents> = {
  components: {
    // Hydratable blocks wrap their render with withHydration in the block file
    // itself; the CMS scanner keys the registry by file name, which must match
    // the block key (e.g. hero-section.tsx -> HeroSection).
    HeroSection,
    FeaturesSection,
    CapabilitiesSection,
    PricingSection,
    PricingPageHero,
    PricingPagePlans,
    PricingPageComparison,
    PricingPageAssistant: PricingPageAssistantBlock,
    HowItWorksHero: HowItWorksHeroBlock,
    HowItWorksSteps,
    HowItWorksLayers: HowItWorksLayersBlock,
    HowItWorksBento: HowItWorksBentoBlock,
    HowItWorksCta,
    TermsPageSections: TermsPageSectionsBlock,
    BlogHeroSection: BlogHeroSectionBlock,
    BlogListingSection: BlogListingSectionBlock,
    ArticlePageSections: ArticlePageSectionsBlock,
  },
  categories: {
    homepage: {
      components: [
        "HeroSection",
        "FeaturesSection",
        "CapabilitiesSection",
        "PricingSection",
      ],
    },
    pricing: {
      title: "Pricing page",
      components: [
        "PricingPageHero",
        "PricingPagePlans",
        "PricingPageComparison",
        "PricingPageAssistant",
      ],
    },
    howItWorks: {
      title: "How it works page",
      components: [
        "HowItWorksHero",
        "HowItWorksSteps",
        "HowItWorksLayers",
        "HowItWorksBento",
        "HowItWorksCta",
      ],
    },
    pages: {
      title: "Page sections",
      components: ["TermsPageSections"],
    },
    blog: {
      components: [
        "BlogHeroSection",
        "BlogListingSection",
        "ArticlePageSections",
      ],
    },
  },
}

export default config
