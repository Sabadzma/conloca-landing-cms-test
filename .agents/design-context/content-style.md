# Content style

Evidence: `src/homepage-content.ts`, `src/how-it-works-page-content.ts`,
`src/pricing-page-content.ts`, `src/blog-content.ts`,
`src/article-page-content.ts`.

## Headlines

Classification: Canonical

- Sentence case, no trailing period: "Keep content in your repo. Give editors a
  visual editing interface", "Choose a plan that fits you the best", "Your
  repository is the CMS". (Internal periods are fine; final periods are not.)
- Short: hero headlines run 5–11 words and fit a 280–872px measure.
- Direct second person, plain verbs: "Build and edit pages visually without
  touching the codebase", "Start with an Astro project".
- Occasional paired-contrast constructions: "Everything you need / nothing you
  don't" (second line in lime), "Three layers / Single foundation"
  (newline-separated, rendered with `white-space: pre-line`).

## Supporting copy

Classification: Canonical

- Italic, 1–3 sentences, concrete mechanism over benefit adjectives.
- A recurring **bold-lead + plain-tail** construction is modeled explicitly in
  content types: `HeroMessages` are `[emphasis, supporting]` tuples and
  blog/article descriptions are `{ emphasis, supporting, emphasisFirst? }`
  objects. The bold sentence states the fact; the tail explains it:
  "**Map your React components to typed schemas and MDS blocks in the IDE.**
  Visual edits respect the structure you define and stay in Git."
- Terminology is consistent and technical: Git-native, repository, MDX/MDS
  blocks, visual editor, locales, fragments, pull requests, CI/CD. Never "CMS"
  without qualification — the product positions against hosted CMSs ("No content
  database. No hosted CMS API…").

## Labels and eyebrows

Classification: Canonical

Roboto Mono, uppercase, 12px. Breadcrumbs use " / " separators ("PRICING /
PLANS"). Step numbers are zero-padded ("01"–"04"). Blog metadata combines read
time and date ("4 MIN READ / SEPTEMBER 2026"). Plan feature groups and the
comparison eyebrow use the same mono-uppercase treatment.

## CTAs

Classification: Canonical

Imperative, two words preferred, sentence case: "Get started" (primary,
everywhere), "Try editor" (secondary), "Read docs", "Compare plans", "Choose
simple / Choose pro / Choose business" (plan CTAs deliberately lowercase the
plan name). Header/footer always carry "Get started". Links that go to the
docs use "Read docs".

## Pricing and numbers

- Whole-dollar prices ($8, $15, $200); annual = monthly × 12, no discount
  framing; interval labels "/ Month", "/ Year".
- Feature lists are terse noun phrases with exact limits: "3 seats included ($5
  per additional seat)", "20GB repository storage".
- The featured plan is always "Pro" with a "Best value" badge.

## Tone

Classification: Recurring

Practitioner-to-practitioner, dry, confident. Article prose uses short
declarative sentences and concrete scenarios ("A marketer knows the copy was
approved. They don't know which build it shipped in."). Contractions are fine.
No exclamation marks, no emoji in copy (one emoji lives inside the Markdown
bento artwork, which is why that asset is a PNG-derived WebP), no hype
adjectives. Blog sign-off: "Notes on content, code, and the space between".

## Product naming

"Conloca" everywhere; the editor is "the visual editor"; content units are
"blocks", "fragments", "collections", "locales". Pages are "Stories/Insights/
Updates" in blog breadcrumbs. Astro is the named integration surface
("Built for Astro" badge).
