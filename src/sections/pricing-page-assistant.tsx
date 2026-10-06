import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import ChatGPTIcon from "@conloca-design-system/icons/gpt.svg?react"
import ClaudeIcon from "@conloca-design-system/icons/claude.svg?react"
import GeminiIcon from "@conloca-design-system/icons/gemini.svg?react"
import GrokIcon from "@conloca-design-system/icons/grok.svg?react"
import MailIcon from "@conloca-design-system/icons/chat-square-01.svg?react"
import type { ContentLink } from "@/lib/content"

export type PricingAssistantIcon = "chatgpt" | "claude" | "gemini" | "grok" | "mail"

export interface PricingAssistantAction extends ContentLink {
  icon: PricingAssistantIcon
  /** Open the destination in a new tab. Use for external assistants. */
  newTab?: boolean
}

export interface PricingPageAssistantContent {
  heading: string
  description: string
  actions: readonly PricingAssistantAction[]
}

export interface PricingPageAssistantProps {
  content: PricingPageAssistantContent
}

const assistantIcons = {
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gemini: GeminiIcon,
  grok: GrokIcon,
  mail: MailIcon,
} satisfies Record<PricingAssistantIcon, typeof ChatGPTIcon>

// Static section: no client state, renders without hydration.
export function PricingPageAssistant({ content }: PricingPageAssistantProps) {
  return (
    <section className="pricing-assistant" aria-labelledby="pricing-assistant-heading">
      <div className="pricing-assistant-inner">
        <div className="pricing-assistant-copy">
          <h2 id="pricing-assistant-heading">{content.heading}</h2>
          <p>{content.description}</p>
        </div>
        <div className="pricing-assistant-actions">
          {content.actions.map((action) => {
            const Icon = assistantIcons[action.icon]
            return (
              <a
                key={action.label}
                className={conlocaButtonVariants({
                  variant: "secondary",
                  size: "default",
                }) + " pricing-assistant-action"}
                data-slot="conloca-button"
                href={action.url}
                rel={action.newTab ? "noopener noreferrer" : undefined}
                target={action.newTab ? "_blank" : undefined}
              >
                <Icon aria-hidden="true" />
                <span>{action.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
