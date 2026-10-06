import type { ReactElement } from "react"
import { cleanup, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import config from "@/puck.config"

// Regression guard for the editor's "add item" flow. Puck constructs a new
// array item as `field.defaultItemProps ?? {}` (see @puckeditor/core
// ArrayField), so any array field without defaultItemProps produces a sparse
// object that crashes section renders reading nested properties
// (e.g. `item.action.url`). This suite walks every registered block's field
// tree, synthesizes the exact item Puck would create for each array field,
// appends it to a clone of the block's defaultProps, and renders the block —
// any field that cannot survive its own "add item" fails here with the block
// key and field path.

interface FieldLike {
  type: string
  arrayFields?: Record<string, FieldLike>
  objectFields?: Record<string, FieldLike>
  defaultItemProps?: unknown
}

interface ArrayFieldCase {
  path: readonly (string | number)[]
  field: FieldLike
}

// Mirrors the traversal Puck data performs: array items may themselves
// contain object and array fields, so paths carry numeric segments for
// "inside item 0".
function collectArrayFields(
  fields: Record<string, FieldLike>,
  path: readonly (string | number)[] = [],
): ArrayFieldCase[] {
  const cases: ArrayFieldCase[] = []
  for (const [key, field] of Object.entries(fields)) {
    if (field.type === "array") {
      cases.push({ path: [...path, key], field })
      if (field.arrayFields)
        cases.push(...collectArrayFields(field.arrayFields, [...path, key, 0]))
    } else if (field.type === "object" && field.objectFields) {
      cases.push(...collectArrayFields(field.objectFields, [...path, key]))
    }
  }
  return cases
}

// Mirrors @puckeditor/core's ArrayField add-item behavior exactly.
function synthesizeNewItem(field: FieldLike, existingLength: number): unknown {
  const defaults = field.defaultItemProps
  return typeof defaults === "function"
    ? (defaults as (index: number) => unknown)(existingLength)
    : (defaults ?? {})
}

function appendAtPath(
  root: Record<string, unknown>,
  path: readonly (string | number)[],
  item: unknown,
): void {
  let node: Record<string, unknown> | unknown[] = root
  for (const segment of path.slice(0, -1)) {
    node = (node as Record<string, unknown>)[segment] as
      | Record<string, unknown>
      | unknown[]
  }
  const leaf = (node as Record<string, unknown>)[path[path.length - 1]!]
  if (!Array.isArray(leaf))
    throw new Error(`defaultProps path ${path.join(".")} is not an array`)
  leaf.push(item)
}

function formatPath(path: readonly (string | number)[]): string {
  return path
    .reduce<string>(
      (acc, segment) =>
        typeof segment === "number" ? `${acc}[${segment}]` : `${acc}.${segment}`,
      "",
    )
    .slice(1)
}

// lottie-web touches canvas at module scope, which jsdom cannot provide; the
// capabilities artwork never plays in these tests, so the player is stubbed.
vi.mock("lottie-web", () => ({
  default: {
    loadAnimation: () => ({
      addEventListener: () => {},
      destroy: () => {},
      setLoop: () => {},
      playSegments: () => {},
      play: () => {},
      stop: () => {},
      goToAndStop: () => {},
    }),
  },
}))

beforeEach(() => {
  vi.stubGlobal("matchMedia", (media: string) => ({
    media,
    matches: media === "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => true,
  }))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

interface BlockLike {
  fields: Record<string, FieldLike>
  defaultProps?: Record<string, unknown>
  render: (props: Record<string, unknown>) => ReactElement
}

const blocks = Object.entries(config.components ?? {}) as unknown as [
  string,
  BlockLike,
][]

describe("Puck array fields survive the editor's add-item flow", () => {
  for (const [blockKey, block] of blocks) {
    const cases = collectArrayFields(block.fields)
    if (!block.defaultProps) throw new Error(`${blockKey} has no defaultProps`)
    const defaultProps = block.defaultProps
    for (const { path, field } of cases) {
      it(`${blockKey}: ${formatPath(path)}`, () => {
        const props = structuredClone(defaultProps)
        // Navigate to the target array once to learn its length (Puck passes
        // the index to functional defaultItemProps), then append.
        let node: Record<string, unknown> | unknown[] = props
        for (const segment of path.slice(0, -1)) {
          node = (node as Record<string, unknown>)[segment] as
            | Record<string, unknown>
            | unknown[]
        }
        const existing = (node as Record<string, unknown>)[
          path[path.length - 1]!
        ]
        if (!Array.isArray(existing))
          throw new Error(
            `${blockKey} defaultProps path ${formatPath(path)} is not an array`,
          )
        appendAtPath(props, path, synthesizeNewItem(field, existing.length))
        render(<>{block.render(props)}</>)
        expect(document.body.innerHTML.length).toBeGreaterThan(0)
      })
    }
  }
})
