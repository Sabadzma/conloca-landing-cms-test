---
name: build-page-from-design-context
description: Design and implement a new page for an existing website or SaaS using the repository's established design context as the primary design specification. Use when given a page name, route, Markdown content, requirements, or a loose brief and the finished page must accurately match the existing site's visual language, layout grammar, components, responsiveness, content style, and implementation conventions.
---

# Build Page From Design Context

## Purpose

Design and implement a production-quality page that feels native to the existing website.

The objective is not merely:

> Create a good-looking page.

It is:

> Create the requested page in a way that plausibly looks and behaves as though it was designed by the same team as the rest of this exact site.

Use the project's existing design context as the primary design specification.

---

# Start With Design Context

Locate:

```text
.agents/design-context/
```

Read first:

```text
.agents/design-context/manifest.json
.agents/design-context/README.md
```

Then read only the context documents relevant to the requested page.

For example:

```text
visual-language.md
layout-patterns.md
components.md
section-patterns.md
page-patterns.md
responsive-patterns.md
content-style.md
```

Do not repeat full-project design archaeology when usable design context already exists.

---

# Manifest Is Agent-Managed

`manifest.json` is maintained automatically by `create-design-context`.

Do not ask the user to update it.

Do not manually advance `verifiedCommit` merely because this skill implemented a page.

This skill normally treats the manifest as read-only.

---

# Check Context Freshness

Read:

```json
"verifiedCommit"
```

from `manifest.json`.

When Git is available, compare it with current HEAD.

If they match, proceed normally.

If current HEAD is newer:

1. inspect changed file paths between `verifiedCommit` and HEAD
2. use `watchPaths` and `designSources` from the manifest where useful
3. determine whether the changes can materially affect the requested page or underlying design system

Potentially relevant changes include:

- tokens
- styles
- typography
- shared components
- layout primitives
- marketing components
- navigation
- footer
- existing page layouts
- responsive rules
- icons
- visual assets
- interaction patterns

If changes are unrelated, continue using the current context.

Do not invalidate design context because backend code, documentation, tests, or unrelated files changed.

---

# If Relevant Context May Be Stale

Do not stop the task merely because a relevant source changed.

Instead:

1. inspect the changed implementation needed for this page
2. use current repository evidence to resolve the discrepancy
3. implement against the current project
4. report that the affected design context should be refreshed

If the current environment supports invoking `create-design-context`, use it when a substantial context refresh is clearly necessary.

Do not silently rewrite canonical context from this skill.

---

# If Design Context Does Not Exist

If:

```text
.agents/design-context/
```

does not exist, invoke or follow `create-design-context` before designing the page when the environment supports it.

The intended workflow is:

```text
create-design-context
        ↓
.agents/design-context/
        ↓
build-page-from-design-context
```

Do not ask the user to manually prepare the design context.

---

# Understand the Request

Extract:

- page name
- route
- page purpose
- target audience when known
- provided content
- required sections
- required CTAs
- provided assets
- functional requirements
- metadata/SEO requirements when relevant
- prohibited changes
- degree of creative freedom

Classify requirements internally as:

```text
Required
Strongly implied
Optional
Unknown
```

Do not lose explicit requirements while optimizing layout.

---

# Input Mode: Provided Content

When the user provides finished or mostly finished Markdown/content:

- preserve meaning
- understand hierarchy
- map content onto native design patterns
- reorganize when it materially improves comprehension
- avoid unnecessary rewriting
- retain important claims
- retain required CTAs
- follow established content presentation

The supplied information architecture may be improved, but must not be casually discarded.

---

# Input Mode: Loose Brief

When the user gives more creative freedom:

1. determine the page objective
2. inspect relevant product information in the repository
3. derive an appropriate information architecture
4. write content matching the site's established voice
5. compose the page using established design grammar

Do not fabricate:

- customers
- statistics
- performance claims
- integrations
- certifications
- testimonials
- pricing
- guarantees
- features
- technical capabilities
- company history

Unsupported specificity should be omitted rather than invented.

---

# Design Decision Hierarchy

Prefer:

1. Existing component exactly
2. Existing supported component variant
3. New composition of existing primitives
4. Existing section/layout pattern
5. Adaptation of an established pattern
6. Extension of an established component or pattern
7. Genuinely new pattern

This is a priority order, not an absolute rule.

Do not force inappropriate reuse.

---

# Conservative Visual Language, Flexible Composition

Be conservative about visual grammar.

Be reasonably creative about composition.

Good novelty includes:

- new arrangements of existing primitives
- new combinations of familiar section patterns
- adapting an existing layout family
- new page-level narrative structures
- different relationships between existing component families

Avoid unnecessary invention of:

- typography styles
- spacing systems
- radius families
- shadows
- button styles
- icon styles
- decorative effects
- animation language
- gradients
- unrelated card treatments

New composition is acceptable.

A new visual identity is not.

---

# Avoid Generic AI Landing Pages

Unless supported by the project, do not automatically introduce:

- bento grids
- glowing gradients
- glassmorphism
- giant blurred blobs
- excessive pills
- generic three-card feature rows
- arbitrary icon circles
- gradient text
- floating UI fragments
- fake metrics
- decorative grids
- excessive cards
- gratuitous animation

Do not make every piece of information a card.

Do not decorate whitespace simply because it exists.

---

# Compose Before Implementing

Before coding, establish the page's structure.

For each major section understand:

- communication purpose
- information hierarchy
- closest native section/layout pattern
- reusable components
- required adaptation
- responsive transformation

Example reasoning:

```text
Hero
→ existing centered hero family
→ existing heading and CTA primitives
→ adapted product visual treatment

Explanation
→ narrow editorial pattern

Workflow
→ variation of existing alternating feature layout

Closing CTA
→ existing conversion section
```

This does not need to become a separate artifact unless useful.

---

# Page-Level Composition

Evaluate the entire page as a sequence.

Consider:

- narrative progression
- vertical rhythm
- alternating density
- text-heavy vs visual sections
- section-height variation
- background changes
- CTA placement
- repetition
- escalation or simplification of visual complexity
- page ending

Avoid accidental repetitive structures such as:

```text
Hero
Card grid
Card grid
Card grid
CTA
```

unless the site's actual page grammar supports that pattern.

---

# Reuse Components

Before creating a component, search for an existing equivalent.

Prefer:

```text
existing component
→ existing variant
→ composition of primitives
→ compatible extension
→ new component
```

Do not locally recreate maintained:

- buttons
- cards
- headings
- containers
- screenshot frames
- icon treatments
- CTA blocks
- navigation
- footer

---

# Shared Components

Be careful when changing shared code.

When modification is necessary:

- preserve existing behavior
- prefer a compatible variant
- inspect existing usages
- verify affected pages where appropriate

Do not modify global styling simply to solve one page unless the change is genuinely systemic.

---

# Technical Architecture

Follow the repository's existing conventions for:

- routes
- file organization
- components
- imports
- styling
- TypeScript
- metadata
- images
- assets
- icons
- motion
- data
- tests

Do not introduce a parallel implementation architecture.

---

# Responsive Design

Use the existing responsive context and current code.

Follow established:

- breakpoints
- gutters
- content widths
- stacking
- grids
- typography transformations
- image behavior
- reordering
- hidden/substituted elements
- overflow
- mobile-specific layouts
- tablet-specific layouts

Do not assume every horizontal desktop layout should merely stack vertically.

---

# Content Style

Follow the documented project conventions for:

- capitalization
- headline shape
- sentence length
- terminology
- product naming
- CTA language
- punctuation
- technical depth
- tone

Do not turn restrained product copy into aggressive marketing language unless the project itself uses that style.

---

# Accessibility and Semantics

Verify:

- correct heading hierarchy
- links vs buttons
- labels
- alt text
- keyboard behavior
- logical DOM order
- focus behavior
- responsive accessibility

Visual consistency must not come at the expense of semantic correctness.

---

# Technical Validation

Use the project's existing relevant checks.

Examples:

- formatter
- lint
- type checking
- unit tests
- integration tests
- build

Fix failures introduced by the implementation.

Distinguish pre-existing failures from new regressions.

---

# Rendered Visual Verification

When browser or preview capabilities exist, rendered verification is required.

Inspect representative states corresponding to:

- mobile
- intermediate/tablet
- desktop
- wide desktop when materially different

Choose widths based on the project's actual responsive system rather than blindly applying conventional viewport numbers.

---

# Compare With Existing Pages

Use relevant existing pages from the design context as visual references.

Check:

- navigation
- gutters
- maximum widths
- typography
- heading proportions
- section rhythm
- spacing
- borders
- radii
- shadows
- button treatment
- icons
- imagery
- visual density
- footer
- responsive transformations

The critical question is:

> Does this page unmistakably belong to this website?

---

# Visual QA

Explicitly inspect for:

- horizontal overflow
- clipping
- wrapping problems
- inconsistent gutters
- overly wide copy
- misaligned grids
- incorrect spacing
- stretched images
- incorrect aspect ratios
- breakpoint jumps
- overlap
- z-index problems
- sticky-positioning issues
- footer inconsistencies
- desktop assumptions surviving incorrectly on mobile

Fix issues before completion.

---

# Requirement Verification

Re-read the user's original requirements after implementation.

Verify:

- requested route
- required content
- required sections
- CTAs
- assets
- interactions
- constraints
- metadata when requested

Do not allow visual polish to hide missing requirements.

---

# Design Drift Review

Challenge the finished page.

Ask:

- Did I invent a visual primitive unnecessarily?
- Did I introduce values inconsistent with the existing system?
- Did I default to a generic SaaS layout?
- Is this page more rounded, spacious, colorful, decorative, or animated than neighboring pages?
- Did I misuse existing components?
- Did I add visual effects without project evidence?
- Would this section look surprising if inserted into an existing page?
- Does anything have obvious AI-generated landing-page aesthetics?

Revise when necessary.

---

# New Patterns

A new layout pattern is allowed when the content genuinely requires one.

It must still inherit the project's established:

- typography
- colors
- spacing
- borders
- radii
- density
- component primitives
- imagery
- responsive philosophy
- interaction conventions

A new pattern should usually be explainable as a recombination or logical extension of existing design decisions.

---

# Completion Criteria

The task is complete only when applicable criteria are satisfied.

## Requirements

- Correct page exists.
- Requested content exists.
- Required functionality works.

## Design

- Design context was used.
- Native patterns were preferred.
- New patterns remain compatible.
- Typography matches.
- widths and gutters match.
- spacing matches.
- density matches.
- responsive behavior matches.
- page rhythm feels native.

## Implementation

- Existing architecture is respected.
- Components are reused appropriately.
- Shared changes are safe.
- Semantics are sound.
- No parallel design system was introduced.

## Verification

- Relevant technical checks were run.
- Route renders.
- Responsive states were inspected when rendering tools exist.
- Existing pages were used as comparison references.
- Significant layout defects are resolved.

---

# Completion Report

Report concisely:

1. page implemented
2. most relevant design-context documents
3. existing pages/patterns used as references
4. existing components reused
5. new layout variation, if any
6. responsive states verified
7. technical checks performed
8. any design-context discrepancy discovered

Do not ask the user to maintain `manifest.json`, refresh commit hashes, or perform design-context bookkeeping.

Those responsibilities belong to the design-context skill.