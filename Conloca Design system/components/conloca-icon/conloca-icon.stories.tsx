import type { Meta, StoryObj } from "@storybook/react-vite"

import { ConlocaIcon } from "./conloca-icon"

const meta = {
  title: "Conloca/ConlocaIcon",
  component: ConlocaIcon,
  tags: ["autodocs"],
  args: {
    name: "search-01",
    size: 24,
  },
  argTypes: {
    color: {
      control: "color",
    },
    "data-slot": {
      table: {
        disable: true,
      },
    },
    size: {
      control: "number",
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ConlocaIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ColorAndSize: Story = {
  args: {
    color: "#5d00ff",
    name: "heart",
    size: 40,
  },
}

export const InheritsColor: Story = {
  render: (args) => (
    <div className="text-[var(--color-fg-strong-default-initial)] hover:text-[var(--color-fg-softer-default-hovered)]">
      <ConlocaIcon {...args} aria-label="Search" />
    </div>
  ),
}
