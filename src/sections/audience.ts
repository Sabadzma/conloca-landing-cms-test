import { useCallback, useSyncExternalStore } from "react"

export type Audience = "developers" | "editors"

export interface AudienceOption {
  label: string
  value: Audience
}

// Module-scope store shared by independently hydrated blocks on the same page
// (hero audience selector and feature-card audience selector stay in sync).
// SSR always renders the default; useSyncExternalStore re-reads after hydration
// if another root already changed the value.
let audience: Audience = "developers"
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit() {
  for (const listener of listeners) listener()
}

export function useAudience(): [Audience, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => audience,
    () => "developers" as Audience,
  )
  const setAudience = useCallback((next: string) => {
    if (next !== "developers" && next !== "editors") return
    if (next === audience) return
    audience = next
    emit()
  }, [])
  return [value, setAudience]
}

// Test isolation: the store outlives individual mounts, so suites reset it
// between cases (per-mount useState used to provide this implicitly).
export function resetAudience() {
  if (audience === "developers") return
  audience = "developers"
  emit()
}
