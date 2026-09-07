import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { ConlocaSegmentedControl } from "./conloca-segmented-control"

const audienceOptions = [
  { label: "Developers", value: "developers" },
  { label: "Content editors", value: "content-editors" },
] as const

const defaultOptions = [
  { label: "Item 1", value: "item-1" },
  { label: "Item 2", value: "item-2" },
] as const

const multipleOptions = [
  { label: "Item 1", value: "item-1" },
  { label: "Item 2", value: "item-2" },
  { label: "Item 3", value: "item-3" },
  { label: "Item 4", value: "item-4" },
] as const

const meta = {
  title: "Conloca/ConlocaSegmentedControl",
  component: ConlocaSegmentedControl,
  tags: ["autodocs"],
  args: {
    "aria-label": "Audience",
    defaultValue: "item-1",
    disabled: false,
    onValueChange: fn(),
    options: defaultOptions,
    transparent: false,
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Initial active option value as a free-form string.",
    },
    disabled: {
      control: "boolean",
    },
    options: {
      control: "object",
    },
    transparent: {
      control: "boolean",
    },
    value: {
      control: "text",
      description: "Active option value as a free-form string.",
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ConlocaSegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const FirstSelected: Story = {}

export const SecondSelected: Story = {
  args: {
    value: "item-2",
  },
}

export const TransparentFirstSelected: Story = {
  args: {
    transparent: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (StoryComponent) => (
      <div className="bg-[var(--color-bg-primary-initial)] p-[32px]">
        <StoryComponent />
      </div>
    ),
  ],
}

export const TransparentSecondSelected: Story = {
  args: {
    transparent: true,
    value: "item-2",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (StoryComponent) => (
      <div className="bg-[var(--color-bg-primary-initial)] p-[32px]">
        <StoryComponent />
      </div>
    ),
  ],
}

export const KeyboardSelection: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const firstOption = canvas.getByRole("button", { name: "Item 1" })
    const secondOption = canvas.getByRole("button", {
      name: "Item 2",
    })

    await userEvent.tab()
    await expect(firstOption).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(secondOption).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(secondOption).toHaveAttribute("aria-pressed", "true")
    await expect(args.onValueChange).toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole("button", { name: "Item 1" }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole("button", { name: "Item 2" }),
    ).toBeDisabled()
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-[24px] bg-[var(--color-bg-primary-initial)] p-[24px]">
      <div className="flex gap-[24px]">
        <ConlocaSegmentedControl
          aria-label="Opaque, first option selected"
          options={defaultOptions}
        />
        <ConlocaSegmentedControl
          aria-label="Opaque, second option selected"
          options={defaultOptions}
          value="item-2"
        />
      </div>
      <div className="flex gap-[24px]">
        <ConlocaSegmentedControl
          aria-label="Transparent, first option selected"
          options={defaultOptions}
          transparent
        />
        <ConlocaSegmentedControl
          aria-label="Transparent, second option selected"
          options={defaultOptions}
          transparent
          value="item-2"
        />
      </div>
    </div>
  ),
}

export const CustomizedLabels: Story = {
  args: {
    "aria-label": "Audience",
    defaultValue: "developers",
    options: audienceOptions,
  },
}

export const MultipleOptions: Story = {
  args: {
    "aria-label": "Multiple items",
    defaultValue: "item-1",
    options: multipleOptions,
  },
}
