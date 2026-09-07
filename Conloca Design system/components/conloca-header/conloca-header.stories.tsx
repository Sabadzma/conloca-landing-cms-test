import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { ConlocaHeader } from "./conloca-header"

const menuItems = [
  { label: "How it works", url: "#how-it-works" },
  { label: "Docs", url: "#docs" },
  { label: "Pricing", url: "#pricing" },
  { label: "Blog", url: "#blog" },
] as const

const meta = {
  title: "Conloca/ConlocaHeader",
  component: ConlocaHeader,
  tags: ["autodocs"],
  args: {
    defaultMenuExpanded: false,
    menuItems,
    onMenuClick: fn(),
    onMenuExpandedChange: fn(),
    primaryButton: { label: "Primary" },
    secondaryButton: { label: "Secondary" },
    transparent: false,
  },
  argTypes: {
    menuItems: { control: "object" },
    primaryButton: { control: "object" },
    secondaryButton: { control: "object" },
    transparent: { control: "boolean" },
    logoUrl: { control: "text" },
    navigationLabel: { control: "text" },
    menuButtonLabel: { control: "text" },
    menuCloseButtonLabel: { control: "text" },
    menuControls: { control: "text" },
    menuExpanded: { control: "boolean" },
    defaultMenuExpanded: { control: "boolean" },
    mobileNavigationLabel: { control: "text" },
    onMenuClick: { control: false },
    onMenuExpandedChange: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: {
        desktop1440: {
          name: "Desktop 1440",
          styles: { height: "900px", width: "1440px" },
          type: "desktop",
        },
        tablet640: {
          name: "Tablet 640",
          styles: { height: "900px", width: "640px" },
          type: "tablet",
        },
        mobile393: {
          name: "Mobile 393",
          styles: { height: "852px", width: "393px" },
          type: "mobile",
        },
      },
    },
  },
  globals: {
    viewport: { value: "desktop1440" },
  },
} satisfies Meta<typeof ConlocaHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const AppearingAnimation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Reload the story to replay the 500 millisecond position and opacity entrance animation.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole("banner")
    const styles = getComputedStyle(header)

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await expect(styles.animationDuration).toBe("0s")
      return
    }

    await expect(styles.animationDuration).toBe("0.5s")
    await expect(styles.animationTimingFunction).toBe(
      "cubic-bezier(0.05, 0.7, 0.1, 1)",
    )
  },
}

export const TransparentDesktop: Story = {
  args: { transparent: true },
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-stone-800)]">
      <ConlocaHeader {...args} />
    </div>
  ),
}

export const Tablet: Story = {
  globals: { viewport: { value: "tablet640" } },
}

export const TabletExpanded: Story = {
  args: { defaultMenuExpanded: true },
  globals: { viewport: { value: "tablet640" } },
}

export const Mobile: Story = {
  globals: { viewport: { value: "mobile393" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const menuButton = canvas.getByRole("button", {
      name: "Open navigation menu",
    })

    await userEvent.click(menuButton)
    await expect(args.onMenuClick).toHaveBeenCalled()
    await expect(args.onMenuExpandedChange).toHaveBeenCalledWith(true)

    const closeButton = canvas.getByRole("button", {
      name: "Close navigation menu",
    })
    await expect(closeButton).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(
        canvas.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeVisible(),
    )

    await userEvent.click(closeButton)
    await expect(args.onMenuExpandedChange).toHaveBeenLastCalledWith(false)
    await expect(
      canvas.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false")
  },
}

export const MobileExpanded: Story = {
  args: { defaultMenuExpanded: true },
  globals: { viewport: { value: "mobile393" } },
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-stone-950)]">
      <ConlocaHeader {...args} />
    </div>
  ),
}

export const TransparentMobile: Story = {
  args: { transparent: true },
  globals: { viewport: { value: "mobile393" } },
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-stone-800)]">
      <ConlocaHeader {...args} />
    </div>
  ),
}

export const TransparentMobileExpanded: Story = {
  args: { defaultMenuExpanded: true, transparent: true },
  globals: { viewport: { value: "mobile393" } },
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-stone-800)]">
      <ConlocaHeader {...args} />
    </div>
  ),
}

export const PrimaryOnly: Story = {
  args: { secondaryButton: false },
}

export const SecondaryOnly: Story = {
  args: { primaryButton: false },
}

export const NoActions: Story = {
  args: {
    primaryButton: false,
    secondaryButton: false,
  },
}

export const NavigationHovered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole("link", { name: "How it works" }))
  },
}

export const NavigationPressed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = canvas.getByRole("link", { name: "How it works" })

    await userEvent.pointer({ keys: "[MouseLeft>]", target: item })
    await expect(item).toHaveFocus()
    await userEvent.pointer({ keys: "[/MouseLeft]", target: item })
  },
}

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const item = canvas.getByRole("link", { name: "How it works" })

    await userEvent.tab()
    await userEvent.tab()
    await expect(item).toHaveFocus()
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-[30px] bg-[var(--color-stone-100)] py-[20px]">
      <ConlocaHeader {...args} transparent={false} />
      <div className="bg-[var(--color-stone-800)]">
        <ConlocaHeader {...args} transparent />
      </div>
    </div>
  ),
}
