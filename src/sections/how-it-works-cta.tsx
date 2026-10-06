import { useCallback, useState } from "react"
import CopyIcon from "@conloca-design-system/icons/copy-02.svg?react"
import { cn } from "@/lib/utils"

export type PackageManager = "bun" | "pnpm" | "npm"

export interface HowItWorksCtaContent {
  heading: string
  description: string
  packageManagerLabel: string
  packageManagers: readonly PackageManager[]
  commands: Record<PackageManager, string>
  copyLabel: string
}

export interface HowItWorksCtaProps {
  content: HowItWorksCtaContent
}

function PackageManagerTab({
  active,
  manager,
  onSelect,
}: {
  active: boolean
  manager: PackageManager
  onSelect: (manager: PackageManager) => void
}) {
  const handleClick = useCallback(() => onSelect(manager), [manager, onSelect])
  return (
    <button
      aria-pressed={active}
      className={cn(
        "hiw-terminal__tab",
        active && "hiw-terminal__tab--active",
      )}
      onClick={handleClick}
      type="button"
    >
      {manager}
    </button>
  )
}

// "Start with Astro" install terminal. The package-manager tab state is local
// to this block; hydration is required for the tabs and the copy button.
export function HowItWorksCta({ content }: HowItWorksCtaProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>(
    content.packageManagers[0],
  )
  const command = content.commands[packageManager]

  const copyCommand = useCallback(() => {
    void navigator.clipboard?.writeText(command)
  }, [command])

  return (
    <section className="hiw-cta" aria-labelledby="hiw-cta-heading">
      <div className="hiw-cta__banner">
        <div className="hiw-cta__copy">
          <h2 className="hiw-cta__heading" id="hiw-cta-heading">
            {content.heading}
          </h2>
          <p className="hiw-cta__description">{content.description}</p>
        </div>
        <div className="hiw-terminal">
          <div className="hiw-terminal__header">
            <div
              aria-label={content.packageManagerLabel}
              className="hiw-terminal__tabs"
              role="group"
            >
              {content.packageManagers.map((manager) => (
                <PackageManagerTab
                  active={manager === packageManager}
                  key={manager}
                  manager={manager}
                  onSelect={setPackageManager}
                />
              ))}
            </div>
            <button
              className="hiw-terminal__copy"
              onClick={copyCommand}
              type="button"
            >
              <CopyIcon aria-hidden="true" className="hiw-terminal__copy-icon" />
              {content.copyLabel}
            </button>
          </div>
          <p className="hiw-terminal__command">
            <span className="hiw-terminal__prompt">$</span>
            <code>{command}</code>
          </p>
        </div>
      </div>
    </section>
  )
}
