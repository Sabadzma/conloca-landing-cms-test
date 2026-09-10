import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import { ConlocaProse } from "./conloca-prose"
import type { ConlocaProseBlock } from "./conloca-prose"

import "./conloca-prose.css"

const blocks = [
  {
    type: "group",
    blocks: [
      {
        type: "paragraph",
        text: "A marketer knows the copy was approved. They don't know which build it shipped in. A developer sees the exact technical change. They don't know which campaign decision is sitting behind it.",
      },
      {
        type: "paragraph",
        text: "So you end up with two versions of the truth: what the marketer sees in the CMS, and what actually lives in the project's code.",
      },
    ],
  },
  {
    type: "group",
    blocks: [
      {
        type: "heading",
        text: "Here's how it works in practice:",
        weight: "semibold",
      },
      {
        type: "list",
        items: [
          "The marketer opens a page in the visual editor.",
          "They change text, an image, or metadata, and see the result as they go.",
          "The saved change lands in Git history, where it can be reviewed or rolled back.",
        ],
      },
    ],
  },
  {
    type: "section",
    id: "git-safety-net",
    blocks: [
      { type: "eyebrow", text: "01 — Git’s safety net" },
      {
        type: "heading",
        text: "Git's safety net without Git's learning curve",
      },
      {
        type: "paragraph",
        text: "The real value of Git was never programming knowledge. It's that the project forgets nothing. What changed, who changed it, when, and what it looked like before.",
      },
      {
        type: "table",
        items: [
          {
            title: "Faster campaigns.",
            text: "Every copy and media change no longer needs its own engineering ticket.",
          },
          {
            title: "Safe publishing.",
            text: "Changes are kept in history and can be rolled back the moment you need them.",
          },
        ],
      },
    ],
  },
  {
    type: "list",
    items: [
      "Reverse engineer the Services, except where prohibited by law;",
      "Interfere with or disrupt the integrity, security, or performance of the Services;",
    ],
    marker: "alpha",
  },
] as const satisfies readonly ConlocaProseBlock[]

const meta = {
  title: "Conloca/ConlocaProse",
  component: ConlocaProse,
  tags: ["autodocs"],
  args: {
    blocks,
  },
  argTypes: {
    blocks: { control: "object" },
  },
  parameters: {
    layout: "padded",
    viewport: {
      options: {
        desktop1440: {
          name: "Desktop 1440",
          styles: { height: "900px", width: "1440px" },
          type: "desktop",
        },
        medium1024: {
          name: "Medium 1024",
          styles: { height: "800px", width: "1024px" },
          type: "tablet",
        },
        tablet640: {
          name: "Tablet 640",
          styles: { height: "800px", width: "640px" },
          type: "tablet",
        },
        mobile393: {
          name: "Mobile 393",
          styles: { height: "800px", width: "393px" },
          type: "mobile",
        },
      },
    },
  },
  globals: {
    viewport: { value: "desktop1440" },
  },
} satisfies Meta<typeof ConlocaProse>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvas.getByRole("heading", { level: 2, name: /safety net/ })).toBeVisible()
    const section = canvas.getByText(/safety net/i, { selector: "h2" }).closest("section")
    expect(section).toHaveAttribute("id", "git-safety-net")
    expect(canvas.getAllByRole("listitem").length).toBeGreaterThan(0)
    expect(canvas.getAllByRole("term").length).toBeGreaterThan(0)
  },
}

export const Medium: Story = {
  globals: { viewport: { value: "medium1024" } },
}

export const Tablet: Story = {
  globals: { viewport: { value: "tablet640" } },
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile393" } },
}
