// Shared serializable content leaf types.
export interface ContentLink {
  label: string
  url: string
}

export type BillingInterval = "monthly" | "annual"

export interface HomepageMetadata {
  language: string
  title: string
  description: string
  skipLabel: string
}
