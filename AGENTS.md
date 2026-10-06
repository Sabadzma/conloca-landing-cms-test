# Agent guide

Repository instructions for coding agents (Claude Code, Codex, etc.). This is the
canonical file; the other agent-guide filename is a symlink to it, so every agent
reads the same guide.

## What this repo is

The Conloca marketing landing page, managed by the Conloca CMS. `bun run dev`
serves the site plus the editor at `/__cms`; `bun run build` prerenders all pages
into `dist/client/` and emits a node server bundle in `dist/server/`.

## Stack

| Concern        | Choice                                                            |
| -------------- | ----------------------------------------------------------------- |
| Package manager| bun                                                               |
| Framework      | Astro 7, server output (node adapter), official Vite 8        |
| React plugin   | `@astrojs/react` owns the site transform; plugin-react 5 for tools |
| Linter         | `oxlint` (Oxc). There is no ESLint.                                |
| UI framework   | React 19                                                          |
| Styling        | Tailwind CSS v4, CSS-first config inside `src/index.css`           |
| Components     | shadcn `base-nova` scaffolds customized on Base UI                  |
| Types          | TypeScript, `strict` plus `exactOptionalPropertyTypes`             |

Use official Vite with normal caret ranges and commit exact resolutions in `bun.lock`.
Do not add Vite aliases or forced overrides. One documented exception exists:
`@vitejs/plugin-react` is pinned flat to `^5.2.0` for `@conloca/astro-cms`'s peer
range (see `docs/astro-migration.md`). React and React DOM resolve together
at 19.2.8; Storybook packages stay aligned at 10.6.0. Bun 1.3.14 runs scripts and
installs dependencies; use Node 22.14.0 from `.nvmrc` (minimum 22.12.0).
Astro owns its React transform. Storybook and Vitest use separate plugin instances
from `tooling/vite.ts`; this project does not promise an exclusively Oxc transform.

## Commands

```bash
bun install --frozen-lockfile
bun run dev        # dev server
bun run build      # Astro generates the complete static site in dist/
bun run preview    # serve dist/
bun run lint       # oxlint
bun run typecheck  # astro check && tsc --noEmit
bun run test       # Vitest section, component, and carousel tests
bun run test:e2e   # Playwright against the production build
bun run build-storybook # static design-system catalog
```

## How the CMS architecture works

The site runs the Conloca CMS (`@conloca/astro-cms`). Content lives in `content/`
(Git-backed); editors work in the Puck editor at `/__cms` under `bun run dev`;
`bun run build` prerenders every page from that content into `dist/client/`.
Astro config is `output: "server"` with the standalone node adapter. See
`docs/conloca-cms-integration.md` for the full contract.

Pages render through one injected catch-all route (`/[...slug]`, collection
`pages`) handled by the CMS page handler with `src/layouts/site-layout.astro`.
The layout loads `navigation`/`footer` data entries via content collections and
zod schemas in `src/schemas/data.ts`. Import `src/index.css` before global page
CSS so tokens and fonts precede page rules.

Page bodies are Puck blocks in `src/puck/blocks/`, registered in
`src/puck.config.tsx`. Interactive blocks (audience, capabilities, pricing,
pricing-page, how-it-works) wrap their render in `withHydration`; the CMS
prerenders `[data-hydrate]` markers and the layout loads the hydration entry only
when markers exist. Hydratable block files must be named after their block key
(`audience-sections.tsx` → `AudienceSections`) so the scanner-derived registry key
matches the marker. Do not use `client:only`. Browser APIs belong in effects or
event handlers because every section must render without a DOM.

Keep hero and feature audience state in `AudienceSections`, with ordinary props and
callbacks to reusable children. Its wrapper owns audience CSS variables. Canonical
editable copy lives in block `defaultProps` (mirrored into `content/`); section
props are typed and content is serializable. Keep tokens, layout, icons, and
runtime callbacks in component code. Sections must not depend on Astro or the CMS.

## Component foundation

Reusable components live in `Conloca Design system/components` and start from the
corresponding shadcn `base-nova` implementation. Retain the implementation model
chosen by that edition: a Base UI primitive, Base UI composition utility, or native
markup as appropriate. Application code imports these components only through
`@conloca-design-system/components/<component>`; it does not import
`@base-ui/react` directly.

Do not rerun shadcn initialization. It can overwrite the Figma-generated token
files. Add one component at a time, inspect the generated source before accepting
it, remove its default visual theme, and rebuild it from the component's Figma
specification with existing Conloca semantic tokens and exact untokenized values.
Shadcn is a development-only scaffold and is not a runtime component dependency.

Components use named exports, preserve refs, accept `className`, expose relevant
Base UI or native props, and provide stable `data-slot` attributes. Add variants
and sizes only when Figma defines them, using `class-variance-authority`. For
composition, use Base UI's `render` model; do not introduce Radix's `asChild`
pattern.

## Icons

Do not add Lucide, Radix, or another icon package. The `iconLibrary` entry in
`components.json` is generator-only metadata because shadcn has no no-icon mode;
it does not permit Lucide in dependencies or accepted source. Generated components
must be staged and reviewed before acceptance. Replace every generated icon with
the matching local Figma SVG, then remove the generated import and dependency.

SVG assets live in `Conloca Design system/icons` with their exact Figma filenames
and contents. Import them statically through the design-system alias with the
`?react` suffix. Do not create approximate aliases, substitute icons, rewrite SVG
artwork, or add a runtime icon registry. Decorative icons use
`aria-hidden="true"`; meaningful standalone icons require an accessible label or
SVG title. If a Figma-referenced icon is missing, stop only that component and
request the asset.

## Conventions

- Conventional commits, one logical change each.
- `bun run lint && bun run typecheck` must pass before committing. Do not use
  `--no-verify`.
- No `any`, no `as any`, no `@ts-ignore`. Model the type instead.

## Writing reports for people (Telegram, PR bodies, spec summaries)

These are read by a human, not another agent, so optimize for being understood:

- Never invent abbreviations or compress terms into fragments. Write the full term.
- Prefer fewer points explained in full sentences over more points compressed into
  jargon. A short list of clear sentences beats a long list of cryptic stubs.
- Expand every non-obvious term at first use (name it in full, then abbreviate if you
  must reuse it).
- When a message exceeds the channel's length limit, cut secondary content — drop whole
  points — rather than compressing the wording of what remains.

## Figma MCP servers

Three servers are registered in `.mcp.json` (project scope, so every agent on the
repo picks them up). Project-scoped servers need a one-time approval: run `claude`
in this directory and approve them, or they stay in `Pending approval`.

| Server | Transport | Auth | Use it for |
| --- | --- | --- | --- |
| `figma` | HTTP, `https://mcp.figma.com/mcp` | OAuth | Figma's own hosted server. Broadest feature set, works on every plan and seat. Link-based: give it a Figma URL as context. |
| `figma-desktop` | HTTP, `http://127.0.0.1:3845/mcp` | none (local) | Dev Mode server inside the Figma desktop app. Reads the current selection, and reaches Code Connect mappings and variables. Needs a Dev or Full seat on a paid plan. |
| `figma-framelink` | stdio, `figma-developer-mcp` | `FIGMA_PAT` | Third-party (Framelink). Works headlessly with just a personal access token, no desktop app and no OAuth. Best fit for background agents. Tools: `get_figma_data`, `download_figma_images`. |

### Token

`figma-framelink` needs a Figma personal access token. `.mcp.json` refers to it as
`${FIGMA_PAT}`, expanded from the environment of the process that launches Claude
Code — `.env` is **not** read automatically. Export it before starting a session:

```bash
set -a && . ./.env && set +a && claude
```

`.env` is gitignored; `.env.example` documents the variable name. Never inline the
token into `.mcp.json`, which is committed.

### Prerequisites for `figma-desktop`

1. Figma desktop app installed and running.
2. The target file open in it.
3. Dev Mode MCP server enabled: Figma menu -> Preferences -> Enable Dev Mode MCP server.
4. A Dev or Full seat on a Professional, Organization, or Enterprise plan. View or
   Collab seats and the Starter plan are capped at 6 tool calls per month.
5. A frame selected, for the tools that act on the current selection.

### Authenticating the official server

Run `/mcp` inside Claude Code, pick `figma`, choose Authenticate, and allow access.
It is free while the server is in beta, and becomes usage-based later.

### Why the Framelink version is pinned exactly

`.mcp.json` pins `figma-developer-mcp@0.13.2` with no caret. The repo default is
caret ranges, and this is the documented exception: the server is fetched by `npx`
at launch and runs with `FIGMA_API_KEY` in its environment. A caret range would
auto-execute any future patch or minor release — including a compromised one —
with a live Figma credential handed to it. Bump this deliberately, after checking
the release.
