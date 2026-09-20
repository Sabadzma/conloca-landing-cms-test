import { useState, type AnimationEvent } from "react"
import CloseIcon from "@conloca-design-system/icons/x-01.svg?react"
import DotsHorizontalIcon from "@conloca-design-system/icons/dots-horizontal.svg?react"
import MonitorIcon from "@conloca-design-system/icons/monitor-02.svg?react"
import PhoneIcon from "@conloca-design-system/icons/phone-02.svg?react"
import UndoIcon from "@conloca-design-system/icons/undo-01.svg?react"
import RedoIcon from "@conloca-design-system/icons/redo-01.svg?react"
import ChevronSelectorIcon from "@conloca-design-system/icons/chevron-selector-vertical.svg?react"
import TrashIcon from "@conloca-design-system/icons/trash-05.svg?react"
import DotsVerticalIcon from "@conloca-design-system/icons/dots-vertical.svg?react"
import { cn } from "@/lib/utils"
import "@/feature-banner-5.css"


type CodeToken = { text: string; tone?: "key" | "string" | "hidden" }

const TONE_CLASSES = { key: "tk-k", string: "tk-s", hidden: "tk-h" } as const

const LINE_NUMBERS = Array.from({ length: 26 }, (_, i) => i + 1).join("\n")

const CODE_TOKENS: CodeToken[] = [
  { text: "{\n  " },
  { text: '"created"', tone: "key" },
  { text: ": " },
  { text: '"2026-08-12T09:14:03.000Z"', tone: "string" },
  { text: ",\n  " },
  { text: '"id"', tone: "key" },
  { text: ": " },
  { text: '"vx-home-a1b2c3d4"', tone: "string" },
  { text: ",\n  " },
  { text: '"meta"', tone: "key" },
  { text: ": {\n    " },
  { text: '"description"', tone: "key" },
  { text: ': "' },
  { text: 'Turn text to video in minutes",\n    "title', tone: "string" },
  { text: ": " },
  { text: '"Home"\n', tone: "string" },
  { text: "  },\n  " },
  { text: '"modified"', tone: "key" },
  { text: ": " },
  { text: '"2026-09-03T15:06:41.000Z"', tone: "string" },
  { text: ",\n  " },
  { text: '"type"', tone: "key" },
  { text: ": " },
  { text: '"puck"', tone: "string" },
  { text: ",\n  " },
  { text: '"content"', tone: "key" },
  { text: ": {\n    " },
  { text: '"puckData"', tone: "key" },
  { text: ": {\n      " },
  { text: '"content"', tone: "key" },
  { text: ": [\n        {\n          " },
  { text: '"props"', tone: "key" },
  { text: ": {\n            " },
  { text: '"buttons"', tone: "key" },
  { text: ": [\n              {\n                " },
  { text: '"href"', tone: "key" },
  { text: ": " },
  { text: '"/signup"', tone: "string" },
  { text: ",\n" },
  { text: '                "label": "Get started",\n', tone: "hidden" },
  { text: "                " },
  { text: '"variant"', tone: "key" },
  { text: ": " },
  { text: '"primary"\n', tone: "string" },
  { text: "              }\n            ],\n            " },
  { text: '"description"', tone: "key" },
  { text: ": " },
  { text: '"Create studio-quality videos with AI avatars\n                            in 130+ languages"', tone: "string" },
  { text: ",\n            " },
  { text: '"eyebrow"', tone: "key" },
  { text: ": " },
  { text: '"Open source"', tone: "string" },
  { text: ",\n            " },
  { text: '"id"', tone: "key" },
  { text: ": " },
  { text: '"Hero-a1b2c3d4"', tone: "string" },
  { text: ",\n            " },
  { text: '"title"', tone: "key" },
  { text: ": " },
  { text: '"Turn text to video in minutes”\n', tone: "string" },
  { text: "          },\n          " },
  { text: '"type"', tone: "key" },
  { text: ": " },
  { text: '"Hero"\n', tone: "string" },
  { text: "        }\n      ],\n      " },
  { text: '"root"', tone: "key" },
  { text: ": {},\n      " },
  { text: '"zones"', tone: "key" },
  { text: ": {}\n    }\n  }\n}" },
]

type MotionPhase = "idle" | "enter" | "loop"

export interface FeatureBanner5Props {
  play?: boolean
  demo?: boolean
  direction?: "down" | "up"
  className?: string
}

export function FeatureBanner5({
  play = false,
  demo = false,
  direction = "down",
  className,
}: FeatureBanner5Props) {
  const [phase, setPhase] = useState<MotionPhase>("idle")

  if (!demo) {
    if (play && phase === "idle") {
      setPhase("enter")
    } else if (!play && phase !== "idle") {
      setPhase("idle")
    }
  }

  const handleLootieAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.animationName.includes("lootie-enter") && play) setPhase("loop")
  }

  return (
    <div
      className={cn(
        "feature-banner-5",
        demo ? "feature-banner-5--demo" : `feature-banner-5--${phase}`,
        className,
      )}
      data-dir={direction}
      aria-hidden="true"
    >
      <div
        className="lootie-animation-01"
        onAnimationEnd={handleLootieAnimationEnd}
      >
        <div className="code-window">
          <div className="code-tabbar">
            <div className="code-tab">
              <div className="code-tab-name">
                <img src="/assets/feature-banner-5-braces.svg" alt="" />
                <span>homepage.vx.json</span>
              </div>
              <span className="fb5-icon code-tab-close">
                <CloseIcon />
              </span>
            </div>
            <div className="code-tab-actions fb5-icon">
              <DotsHorizontalIcon />
            </div>
          </div>
          <div className="code-body">
            <div className="code-scroll">
              <div className="line-numbers">{LINE_NUMBERS}</div>
              <div className="code-inner">
                <div className="code-snippet">
                  <div className="code-clip">
                    <span>
                    {CODE_TOKENS.map((token, index) =>
                      token.tone ? (
                        <span key={index} className={TONE_CLASSES[token.tone]}>
                          {token.text}
                        </span>
                      ) : (
                        token.text
                      ),
                    )}
                  </span>
                </div>
                </div>
                <div className="line-numbers">{LINE_NUMBERS}</div>
              </div>
            </div>
            <div className="changing-text">
              <span className="ct-part">
                <span className="tk-k">{'"label"'}</span>
                <span>{": "}</span>
                <span className="tk-s">{'"'}</span>
              </span>
              <div className="editable-text">
                <span className="text-two">Create account</span>
                <span className="text-one">Get started</span>
              </div>
              <div className="blinker">
                <div className="blinker-name">
                  <span>Niko</span>
                </div>
                <div className="blinker-bar" />
              </div>
              <span className="ct-part">
                <span className="tk-s">{'"'}</span>
                <span>{","}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="lootie-animation-01-item-02">
          <div className="builder-toolbar">
            <div className="builder-breadcrumb" />
            <div className="device-switch">
              <div className="device-switch-item device-switch-item--active fb5-icon">
                <MonitorIcon />
              </div>
              <div className="device-switch-item">
                <img src="/assets/feature-banner-5-tablet.svg" alt="" />
              </div>
              <div className="device-switch-item fb5-icon">
                <PhoneIcon />
              </div>
            </div>
            <div className="toolbar-right">
              <div className="history-group">
                <div className="history-button history-button--undo fb5-icon">
                  <UndoIcon />
                </div>
                <div className="history-button history-button--redo fb5-icon">
                  <RedoIcon />
                </div>
              </div>
              <div className="publish-button">
                <span>Publish</span>
              </div>
            </div>
          </div>
          <div className="builder-body">
            <div className="preview-card">
              <div className="hero-copy">
                <span className="hero-eyebrow">Open source</span>
                <h3 className="hero-title">Turn text to video in minutes</h3>
                <p className="hero-subtitle">
                  Create studio-quality videos with AI avatars and voiceovers in
                  130+ languages
                </p>
                <div className="hero-cta">
                  <div className="button-text">
                    <span className="text-01">Create account</span>
                    <span className="text-2">Get started</span>
                  </div>
                </div>
              </div>
              <div className="hero-media">
                <img src="/assets/feature-banner-5-hero-media.svg" alt="" />
              </div>
              <div className="block-rail">
                <div className="block-rail-item block-rail-item--active fb5-icon">
                  <ChevronSelectorIcon />
                </div>
                <div className="block-rail-item fb5-icon">
                  <TrashIcon />
                </div>
                <div className="block-rail-item fb5-icon">
                  <DotsVerticalIcon />
                </div>
              </div>
            </div>
            <div className="skeleton-card">
              <div className="skeleton-lines">
                <div className="skeleton-bar skeleton-bar--wide" />
                <div className="skeleton-bar skeleton-bar--narrow" />
              </div>
              <div className="skeleton-row">
                <div className="skeleton-cell" />
                <div className="skeleton-cell" />
                <div className="skeleton-cell" />
              </div>
            </div>
            <div className="cursor">
              <div className="cursor-pointer">
                <img src="/assets/feature-banner-5-cursor.svg" alt="" />
              </div>
              <div className="cursor-tag-row">
                <div className="cursor-tag">
                  <span>Mariam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
