import { useState } from "react"
import FileIcon from "@conloca-design-system/icons/file-02.svg?react"
import GitBranchIcon from "@conloca-design-system/icons/git-branch.svg?react"
import { cn } from "@/lib/utils"
import "@/feature-banner-03.css"


type CodeRowTone = "hunk" | "removed" | "added"

type CodeRow = {
  oldNum: string
  newNum: string
  code: string
  tone?: CodeRowTone
}

const CODE_ROWS: CodeRow[] = [
  { oldNum: "", newNum: "", code: "@@ -39,10 +39 @@", tone: "hunk" },
  { oldNum: "31", newNum: "31", code: "" },
  { oldNum: "32", newNum: "32", code: "“button”: {" },
  { oldNum: "33", newNum: "-", code: "    “label”: “Get started”", tone: "removed" },
  { oldNum: "34", newNum: "+", code: "    “label”: “Create account”", tone: "added" },
  { oldNum: "35", newNum: "35", code: "}" },
  { oldNum: "36", newNum: "36", code: "" },
]

const ROW_TONE_CLASSES: Record<CodeRowTone, string> = {
  hunk: "code-row--hunk",
  removed: "code-row--removed",
  added: "code-row--added",
}

type MotionPhase = "idle" | "enter"

export interface FeatureBanner03Props {
  play?: boolean
  demo?: boolean
  className?: string
}

export function FeatureBanner03({
  play = false,
  demo = false,
  className,
}: FeatureBanner03Props) {
  const [phase, setPhase] = useState<MotionPhase>("idle")

  if (!demo) {
    if (play && phase === "idle") {
      setPhase("enter")
    } else if (!play && phase !== "idle") {
      setPhase("idle")
    }
  }

  return (
    <div
      className={cn(
        "feature-banner-03",
        demo ? "feature-banner-03--demo" : `feature-banner-03--${phase}`,
        className,
      )}
      aria-hidden="true"
    >
      <div className="background" />
      <div className="diff-window">
        <div className="diff-body">
          <div className="diff-header">
            <div className="diff-file">
              <span className="fb03-icon diff-file-icon">
                <FileIcon />
              </span>
              <span className="diff-file-name">homepage.vx.json</span>
            </div>
            <div className="diff-counts">
              <span className="diff-count diff-count--added">+1</span>
              <span className="diff-count diff-count--removed">-1</span>
            </div>
          </div>
          <div className="diff-code">
            {CODE_ROWS.map((row) => (
              <div
                key={`${row.oldNum}-${row.code}`}
                className={cn("code-row", row.tone && ROW_TONE_CLASSES[row.tone])}
              >
                <span className="code-cell code-cell--num">{row.oldNum}</span>
                <span className="code-cell code-cell--num">{row.newNum}</span>
                <span className="code-cell code-cell--code">{row.code}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="diff-footer">
          <div className="diff-author">
            <img
              className="diff-avatar"
              src="/assets/feature-banner-03-avatar.png"
              alt=""
              width={40}
              height={40}
            />
            <div className="diff-author-meta">
              <div className="diff-author-row">
                <span className="diff-author-name">Chris</span>
                <span className="diff-author-dot">·</span>
                <span className="diff-author-time">4h ago</span>
              </div>
              <span className="diff-author-sub">Translated CTA text</span>
            </div>
          </div>
          <div className="diff-merge">
            <span className="fb03-icon diff-merge-icon">
              <GitBranchIcon />
            </span>
            <span>Merge pull request</span>
          </div>
        </div>
        <div className="cursor">
          <div className="cursor-pointer">
            <img src="/assets/feature-banner-03-cursor.svg" alt="" />
          </div>
          <div className="cursor-tag">Danny</div>
        </div>
      </div>
    </div>
  )
}
