import type { Audience, AudienceOption } from "@/homepage-content"

export interface AudienceControlProps {
  audience: Audience
  options: readonly AudienceOption[]
  onAudienceChange: (value: string) => void
}
