# Agent guide

Repository instructions for coding agents (Claude Code, Codex, etc.). This is the
canonical file; the other agent-guide filename is a symlink to it, so every agent
reads the same guide.

## What this repo is

The Conloca marketing landing page: a statically generated single page. There is no
server at runtime — `bun run build` emits a `dist/` directory of static files.

## Stack

| Concern        | Choice                                                            |
| -------------- | ----------------------------------------------------------------- |
| Package manager| bun                                                               |
| Bundler        | Vite 7, aliased to `rolldown-vite` (Rust bundler, Oxc-based)       |
| React plugin   | `@vitejs/plugin-react` (uses Oxc, not Babel, under rolldown-vite)  |
| Linter         | `oxlint` (Oxc). There is no ESLint.                                |
| UI framework   | React 19                                                          |
| Styling        | Tailwind CSS v4, CSS-first config inside `src/index.css`           |
| Components     | shadcn `base-nova` scaffolds customized on Base UI                  |
| Types          | TypeScript, `strict` plus `exactOptionalPropertyTypes`             |

`vite` in `package.json` is an alias: `"vite": "npm:rolldown-vite@^7.3.1"`. Keep the
`overrides` and `resolutions` entries in sync with it, or transitive dependencies
will pull in stock Vite alongside it.

## Commands

```bash
bun install
bun run dev        # dev server
bun run build      # client build -> SSR build -> prerender into dist/index.html
bun run preview    # serve dist/
bun run lint       # oxlint
bun run typecheck  # tsc --noEmit
```

## How static generation works

Three steps, wired together by the `build` script:

1. `vite build` — client bundle into `dist/`, with `index.html` still holding the
   `<!--app-html-->` marker.
2. `vite build --ssr src/entry-server.tsx` — server bundle into `dist-ssr/`. The
   entry is passed on the command line, not via `build.ssr`: rolldown-vite resolves
   the HTML input first and rejects the build otherwise.
3. `scripts/prerender.ts` — imports the server bundle, renders through React 19's
   `prerender()` from `react-dom/static`, and splices the markup into
   `dist/index.html`. Missing marker or empty markup is a hard build failure.

Every component therefore runs twice: once with no DOM on the build machine, once
during `hydrateRoot`. Browser APIs must be deferred to an effect.

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
