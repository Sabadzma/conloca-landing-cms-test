import { useCallback, useSyncExternalStore } from "react"
import type { BillingInterval } from "@/lib/content"

// Module-scope store shared by independently hydrated pricing blocks (hero
// toggle, plan prices, comparison toggle and prices stay in sync). SSR always
// renders monthly; useSyncExternalStore re-reads after hydration.
let billing: BillingInterval = "monthly"
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useBillingInterval(): [BillingInterval, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => billing,
    () => "monthly" as BillingInterval,
  )
  const selectBilling = useCallback((next: string) => {
    if (next !== "monthly" && next !== "annual") return
    if (next === billing) return
    billing = next
    for (const listener of listeners) listener()
  }, [])
  return [value, selectBilling]
}


// Test isolation: the store outlives individual mounts, so suites reset it
// between cases (per-mount useState used to provide this implicitly).
export function resetBilling() {
  if (billing === "monthly") return
  billing = "monthly"
  for (const listener of listeners) listener()
}