---
name: create-design-context
description: Inspect an existing website or SaaS repository and create or refresh a structured, evidence-based design context describing its visual language, foundations, components, layout patterns, section patterns, page composition, responsive behavior, content style, and implementation conventions. Use before designing new pages when project design context does not exist, is incomplete, or may have become stale.
---

# Create Design Context

## Purpose

Reverse-engineer the design system and design grammar of the website actually implemented in this repository.

Produce durable project knowledge that other agents can use when designing and implementing new pages.

This skill does **not** create a new page.

Its primary deliverable is:

```text
.agents/design-context/
```

The context must describe not merely colors, typography, and components, but also the rules by which complete pages are composed.

---

# Ownership

This skill exclusively owns maintenance of:

```text
.agents/design-context/
```

including:

```text
.agents/design-context/manifest.json
```

The user must not be expected to create or maintain any part of this directory manually.

Create, update, repair, and reorganize it automatically as necessary.

Other page-building skills may read this context, but should not silently redefine its canonical design rules.

---

# Source of Truth

The existing implemented website is the primary source of truth.

Describe what the project demonstrably **is**, not what it theoretically should be.

Use evidence from:

- implemented pages
- rendered pages when available
- shared components
- design-system resources
- stylesheets
- CSS variables
- design tokens
- Tailwind or equivalent configuration
- assets
- typography configuration
- responsive implementation
- interaction code
- existing content

Do not derive the site's design language from generic web-design practices.

---

# Evidence Priority

When sources disagree, prefer:

1. Current rendered behavior of actively used pages
2. Shared components actively used by those pages
3. Active tokens, styles, and layout primitives
4. Current design-system documentation
5. Page-specific implementations
6. Legacy, unused, experimental, or dead code

Actual usage is more authoritative than theoretical availability.

---

# Determine Current Context State

First check whether:

```text
.agents/design-context/
```

exists.

## If it does not exist

Perform initial design-context extraction.

Create the directory, context documents, and `manifest.json`.

## If it exists

Read:

```text
.agents/design-context/manifest.json
```

and:

```text
.agents/design-context/README.md
```

Determine whether the context requires:

- no update
- targeted refresh
- broader refresh
- repair because existing context is incomplete or malformed

Do not rebuild everything merely because Git HEAD has advanced.

---

# Automatic Manifest

Maintain:

```text
.agents/design-context/manifest.json
```

This file is entirely agent-managed.

Its purpose is to make future design-context usage fast and to help determine whether cached design knowledge may be stale.

It contains metadata and source indexing, not the design system itself.

Use a structure approximately like:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-10T00:00:00Z",
  "verifiedCommit": "a84f9de",
  "project": {
    "framework": "nextjs",
    "styling": "tailwind",
    "sourceRoot": "src"
  },
  "designSources": {
    "tokens": [],
    "globalStyles": [],
    "components": [],
    "assets": [],
    "fonts": []
  },
  "watchPaths": [],
  "representativePages": [
    {
      "route": "/",
      "source": "src/app/page.tsx",
      "role": "primary marketing reference"
    }
  ],
  "contextFiles": {
    "visualLanguage": "visual-language.md",
    "foundations": "foundations.md",
    "layouts": "layout-patterns.md",
    "components": "components.md",
    "sections": "section-patterns.md",
    "pages": "page-patterns.md",
    "responsive": "responsive-patterns.md",
    "content": "content-style.md"
  }
}
```

Adapt the structure when the repository architecture requires it.

Do not add design decisions such as exact radii, colors, or page rules to the manifest.

Those belong in Markdown context or authoritative source files.

---

# Manifest Freshness Logic

When Git is available, record the current repository commit after successful context verification:

```bash
git rev-parse HEAD
```

Store it as:

```json
"verifiedCommit": "<commit>"
```

On a later invocation, compare the manifest's `verifiedCommit` with current HEAD.

If they match, existing context can normally be treated as current.

If they differ, inspect changes since the verified commit.

Use relevant Git diff information, for example:

```bash
git diff --name-only <verifiedCommit>..HEAD
```

or restrict the diff to known `watchPaths`.

Determine whether changes affect:

- design tokens
- global styles
- typography
- shared UI components
- marketing components
- layout primitives
- existing marketing pages
- navigation
- footer
- responsive rules
- icons
- imagery or visual assets
- interaction patterns

If changes are unrelated to the design system, do not regenerate context.

If only part of the design system changed, perform a targeted refresh.

If foundational design architecture changed substantially, perform a broader refresh.

The user must never be asked to maintain freshness metadata manually.

---

# Repository Reconnaissance

Understand the project before documenting the design.

Determine:

- framework
- routing architecture
- styling architecture
- component architecture
- design-system location
- token location
- global styles
- fonts
- assets
- icons
- motion system
- breakpoints
- testing/build setup

Find actual locations rather than assuming conventional paths.

Record important discovered paths in `manifest.json`.

---

# Select Representative Pages

Do not analyze only the homepage.

Choose a small, representative sample covering different design situations.

Possible references include:

- homepage
- product/feature page
- pricing page
- content-heavy page
- blog/article page
- documentation-style page
- conversion page
- page with unusual layouts relevant to the wider system

Prefer relevance and diversity over quantity.

Three to six strong references are generally preferable to a large random sample.

Record the pages actually inspected in `manifest.json`.

---

# Inspect Rendered Output

When browser or preview capabilities exist:

1. run the application
2. inspect representative pages
3. inspect meaningful responsive states
4. compare rendering with source implementation

Rendered output reveals the actual design.

Source code reveals how it is constructed.

Use both.

If rendered verification cannot be performed, record that limitation in the context.

---

# Classify Findings

Do not treat every observed implementation value as a system rule.

Use classifications such as:

- **Canonical** — explicitly systemic or broadly reused
- **Recurring** — repeatedly observed
- **Local** — intentionally limited to a context
- **Exception** — deliberate deviation
- **Uncertain** — insufficient evidence

Example:

```md
### Marketing content container

Classification: Canonical

Rule:
Primary marketing sections use the shared constrained content container.

Evidence:
- `src/components/layout/MarketingContainer.tsx`
- `src/app/page.tsx`
- `src/app/pricing/page.tsx`

Exceptions:
Some product visuals deliberately extend beyond the content bounds.
```

Do not promote arbitrary one-off values into design rules.

---

# Analyze the Design as Layers

Understand:

```text
Visual language
    ↓
Foundations and tokens
    ↓
Components
    ↓
Layout primitives
    ↓
Section patterns
    ↓
Page composition patterns
    ↓
Responsive transformations
```

Do not reduce design-context extraction to a token inventory.

---

# Visual Language

Document what visually distinguishes this project.

Analyze characteristics such as:

- restrained vs expressive
- dense vs spacious
- editorial vs product-oriented
- geometric vs organic
- sharp vs soft
- monochrome vs colorful
- flat vs layered
- border-driven vs surface-driven
- typography-led vs image-led
- decorative vs utilitarian

Avoid generic design prose that could describe almost any modern SaaS.

---

# Foundations

Understand:

- typography
- font families
- weights
- type hierarchy
- line heights
- letter spacing
- color roles
- spacing logic
- content widths
- page gutters
- borders
- radii
- shadows
- grids
- breakpoints

If exact values already have an authoritative source, reference that source instead of duplicating the full token set.

Document how the system is used, not merely the values it contains.

---

# Layout Patterns

Analyze:

- global containers
- maximum widths
- reading widths
- wide visual regions
- full-bleed regions
- page gutters
- section spacing
- horizontal alignment
- grids
- split layouts
- asymmetric layouts
- sticky regions
- overlap
- background transitions

Identify reusable layout grammar.

Use existing project terminology when available.

---

# Components

Identify:

- design-system primitives
- shared marketing components
- structural components
- page-specific components
- component variants
- legacy/deprecated components

Prioritize documentation of:

- buttons
- links
- cards
- badges
- tabs
- headings
- feature items
- icon treatments
- navigation
- footer
- screenshot treatments
- browser/device frames
- forms
- accordions
- testimonials
- CTAs

For important components, capture:

- purpose
- variants
- normal contexts
- constraints
- responsive behavior
- source location

---

# Section Patterns

Identify section families that genuinely recur.

Possible examples:

- hero
- social proof
- feature introduction
- product demonstration
- split feature
- feature grid
- workflow
- comparison
- testimonial
- FAQ
- pricing
- closing CTA

For each important family, understand:

- information hierarchy
- layout
- content width
- spacing
- media placement
- variants
- responsive transformation

Do not invent categories merely to fill documentation.

---

# Page Composition Patterns

Study how complete pages are assembled.

This is critical.

Analyze:

- typical openings
- hero-to-body transitions
- vertical rhythm
- visual pacing
- alternation between text-heavy and visual sections
- background transitions
- CTA placement
- repetition
- page-ending patterns
- density changes through the page

Document composition logic, not merely component inventory.

---

# Responsive Patterns

Infer responsive design from actual project behavior.

Determine:

- breakpoints
- gutter changes
- container changes
- typography changes
- grid collapse
- stacking
- reordering
- hidden elements
- substituted UI
- image cropping
- overflow behavior
- tablet-specific behavior
- mobile-specific compositions

Do not summarize the system as "desktop stacks on mobile" unless that is truly what the project does.

---

# Content Style

When sufficient content exists, document:

- headline style
- capitalization
- sentence length
- CTA wording
- terminology
- product naming
- punctuation
- tone
- technical depth
- eyebrow usage
- supporting-copy style
- claims style

Do not invent product facts.

---

# Interaction and Motion

Document meaningful recurring interaction behavior when relevant:

- hover
- focus
- active states
- transitions
- easing
- reveal animations
- accordions
- tabs
- carousels
- scroll interactions

Do not invent a motion system for a site that does not have one.

---

# Recommended Output

Use:

```text
.agents/design-context/
├── manifest.json
├── README.md
├── visual-language.md
├── foundations.md
├── layout-patterns.md
├── components.md
├── section-patterns.md
├── page-patterns.md
├── responsive-patterns.md
├── content-style.md
└── interaction-motion.md
```

This is a recommended organization rather than a mandatory file count.

Combine documents when the project is simple.

Add specialized documents when genuinely useful.

Do not create empty files.

---

# README

`README.md` is the human- and agent-readable entry point.

Include:

- concise description of design identity
- framework and styling approach
- authoritative design-resource locations
- representative reference pages
- major shared component locations
- index of context documents
- notable exceptions
- important uncertainties

Do not duplicate manifest metadata unnecessarily.

---

# Avoid Duplication

The design context is an interpretation and navigation layer.

Do not duplicate:

- complete token files
- entire component implementations
- Storybook
- existing design-system documentation

Reference authoritative sources.

Spend context primarily on:

- relationships
- composition
- usage rules
- responsive transformations
- exceptions
- constraints
- design intent inferred from repeated evidence

---

# Generated Pages Are Not Automatically Canonical

Do not use newly generated, unreviewed pages as primary evidence for established design rules.

Otherwise generated output can recursively redefine the design system.

A new pattern may become part of canonical context when:

- it clearly derives from established rules
- it has become reused and accepted
- or the user explicitly establishes it as a new project convention

---

# Finalization

Before completion:

1. validate context documents
2. ensure significant claims have repository evidence
3. ensure authoritative source paths are correct
4. update `manifest.json`
5. set `generatedAt`
6. set `verifiedCommit` to the commit actually verified
7. update representative pages and watch paths
8. ensure no manual maintenance is required from the user

---

# Quality Test

Ask:

- Can another agent understand how pages are composed without rereading the full repository?
- Can it distinguish canonical patterns from exceptions?
- Can it locate the correct existing component?
- Can it understand spacing and width logic?
- Can it reproduce responsive transformations?
- Can it recognize design drift?
- Can it determine cheaply whether this context may have become stale?

If not, improve the context.

---

# Completion Report

Report concisely:

1. whether context was created, refreshed, or already current
2. representative pages inspected
3. important design resources inspected
4. context documents created or changed
5. whether rendered responsive inspection was performed
6. any unresolved uncertainty

The user should not be asked to maintain `manifest.json` or any other design-context metadata manually.