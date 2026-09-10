import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { ConlocaToc } from "./conloca-toc"

const items = [
  { id: "definitions", title: "Definitions" },
  { id: "provision", title: "Provision of the Services" },
  { id: "license", title: "License and Restrictions" },
  { id: "security", title: "Security" },
  { id: "general", title: "General" },
] as const

const meta = {
  title: "Conloca/ConlocaToc",
  component: ConlocaToc,
  tags: ["autodocs"],
  args: {
    items,
    label: "Contents",
  },
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
  },
  parameters: {
    layout: "padded",
    viewport: {
      options: {
        desktop1440: {
          name: "Desktop 1440",
          styles: { height: "700px", width: "1440px" },
          type: "desktop",
        },
        tablet640: {
          name: "Tablet 640",
          styles: { height: "700px", width: "640px" },
          type: "tablet",
        },
        mobile393: {
          name: "Mobile 393",
          styles: { height: "700px", width: "393px" },
          type: "mobile",
        },
      },
    },
  },
  globals: {
    viewport: { value: "desktop1440" },
  },
} satisfies Meta<typeof ConlocaToc>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole("navigation", { name: "Contents" })
    const links = within(navigation).getAllByRole("link")

    expect(links).toHaveLength(items.length)
    expect(links[0]).toHaveTextContent("01")
    expect(links[0]).toHaveAttribute("href", "#definitions")

    await userEvent.hover(links[0])
    const title = links[0].querySelector('[data-slot="conloca-toc-title"]')
    expect(title && getComputedStyle(title).color).toBe("rgb(41, 37, 36)")

    await userEvent.tab()
    expect(links[0]).toHaveFocus()
    await userEvent.tab()
    expect(links[1]).toHaveFocus()
  },
}

const expectHidden: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const navigation = canvas.getByRole("navigation", { name: "Contents" })

  expect(navigation).not.toBeVisible()
}

/** The TOC is hidden below the 1024px breakpoint on purpose. */
export const Tablet: Story = {
  globals: { viewport: { value: "tablet640" } },
  play: expectHidden,
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile393" } },
  play: expectHidden,
}
