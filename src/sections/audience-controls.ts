import type { Audience, AudienceOption } from "./audience"

export interface AudienceControlProps {
  audience: Audience
  options: readonly AudienceOption[]
  onAudienceChange: (value: string) => void
}
