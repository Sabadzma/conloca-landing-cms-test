import PlusIcon from "@conloca-design-system/icons/plus-01.svg?react"
import ClockIcon from "@conloca-design-system/icons/clock-01.svg?react"
import EditIcon from "@conloca-design-system/icons/edit-03.svg?react"
import { cn } from "@/lib/utils"
import "@/feature-banner-02.css"

const SKELETON_CARDS = ["01", "02", "05", "06"] as const

const LOCALES = [
  { flag: "en", label: "English (en)", status: "Source", tone: "source", row: "en" },
  { flag: "de", label: "Deutsch (de)", status: "1 Change", tone: "amber", row: "de" },
  { flag: "fr", label: "Français (fr)", status: "2 Changes", tone: "amber", row: "fr" },
  { flag: "es", label: "Español (en)", status: "Up to date", tone: "lime", row: "es" },
  { flag: "ja", label: "日本語 (ja)", status: "Up to date", tone: "lime", row: "ja" },
] as const

export interface FeatureBanner02Props {
  demo?: boolean
  className?: string
}

export function FeatureBanner02({ demo = false, className }: FeatureBanner02Props) {
  return (
    <div
      className={cn("feature-banner-02", demo && "feature-banner-02--demo", className)}
      aria-hidden="true"
    >
      {SKELETON_CARDS.map((id) => (
        <div key={id} className={`card card-${id}`}>
          <div className="card-image" />
          <div className="card-text">
            <div className="sk-bar sk-title-a" />
            <div className="sk-bar sk-title-b" />
            <div className="sk-bar sk-body-a" />
            <div className="sk-bar sk-body-b" />
            <div className="sk-bar sk-body-c" />
          </div>
        </div>
      ))}

      <div className="card card--active card-03">
        <div className="card-noise" />
        <div className="card-image card-image--active" />
        <div className="card-text">
          <div className="title-bar title-bar-a">
            <div className="highlight highlight-2" />
          </div>
          <div className="title-bar title-bar-b">
            <div className="highlight highlight-1" />
          </div>
          <div className="sk-bar sk-body-a" />
          <div className="sk-bar sk-body-b" />
          <div className="sk-bar sk-body-c" />
        </div>
      </div>

      <div className="card card--active card-04">
        <div className="card-noise" />
        <div className="card-image card-image--active" />
        <div className="card-text">
          <div className="title-bar title-bar-a">
            <div className="highlight highlight-2" />
          </div>
          <div className="title-bar title-bar-b">
            <div className="highlight highlight-1" />
          </div>
          <div className="sk-bar sk-body-a" />
          <div className="sk-bar sk-body-b" />
          <div className="sk-bar sk-body-c" />
        </div>
      </div>

      <div className="language-selector">
        <div className="ls-header">
          <span className="ls-title">Locales</span>
          <div className="ls-badge">
            <span className="fb02-icon">
              <PlusIcon />
            </span>
            <span className="ls-badge-text">New locale</span>
          </div>
        </div>
        <div className="ls-list">
          {LOCALES.map((locale) => (
            <div key={locale.row} className={`list-item list-item--${locale.row}`}>
              <div className="li-main">
                <img src={`/assets/feature-banner-02-flag-${locale.flag}.png`} alt="" />
                <span>{locale.label}</span>
              </div>
              <div className="li-status">
                <span className={`dot dot--${locale.tone}`} />
                <span>{locale.status}</span>
              </div>
            </div>
          ))}
          <div className="cursor">
            <img src="/assets/feature-banner-02-cursor.svg" alt="" />
          </div>
        </div>
        <div className="ls-footer">
          <div className="ls-clock-badge">
            <span className="fb02-icon">
              <ClockIcon />
            </span>
          </div>
          <span className="ls-footer-text">2 locales need updates</span>
          <div className="review-btn">
            <span className="fb02-icon">
              <EditIcon />
            </span>
            <span className="review-btn-text">Review</span>
          </div>
        </div>
      </div>
    </div>
  )
}
