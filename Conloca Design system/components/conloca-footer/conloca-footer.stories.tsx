import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { ConlocaFooter } from "./conloca-footer"

const navigationItems = [
  { label: "Item 01", url: "#item-01" },
  { label: "Item 02", url: "#item-02" },
  { label: "Item 03", url: "#item-03" },
  { label: "Item 04", url: "#item-04" },
] as const

const meta = {
  title: "Conloca/ConlocaFooter",
  component: ConlocaFooter,
  tags: ["autodocs"],
  args: {
    action: { label: "Button", onClick: fn() },
    logoLabel: "Conloca home",
    logoUrl: "/",
    navigationItems,
    navigationLabel: "Footer navigation",
  },
  argTypes: {
    action: { control: "object" },
    navigationItems: { control: "object" },
    logoLabel: { control: "text" },
    logoUrl: { control: "text" },
    navigationLabel: { control: "text" },
  },
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        desktop1440: {
          name: "Desktop 1440",
          styles: { height: "300px", width: "1440px" },
          type: "desktop",
        },
        tablet640: {
          name: "Tablet 640",
          styles: { height: "300px", width: "640px" },
          type: "tablet",
        },
        mobile393: {
          name: "Mobile 393",
          styles: { height: "300px", width: "393px" },
          type: "mobile",
        },
      },
    },
  },
  globals: {
    viewport: { value: "desktop1440" },
  },
} satisfies Meta<typeof ConlocaFooter>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("contentinfo")).toHaveAttribute(
      "data-slot",
      "conloca-footer",
    )
    await expect(canvas.getByRole("link", { name: "Item 01" })).toHaveAttribute(
      "href",
      "#item-01",
    )
    await userEvent.click(canvas.getByRole("button", { name: "Button" }))
    await expect(args.action && args.action.onClick).toHaveBeenCalled()
  },
}

export const Tablet: Story = {
  globals: { viewport: { value: "tablet640" } },
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile393" } },
}

export const WithoutAction: Story = {
  args: { action: false },
}

export const DisabledAction: Story = {
  args: { action: { disabled: true, label: "Button" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("button", { name: "Button" })).toBeDisabled()
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-[30px] bg-[var(--color-bg-sunken-initial)] py-[20px]">
      <ConlocaFooter {...args} />
      <ConlocaFooter {...args} action={false} />
    </div>
  ),
}
