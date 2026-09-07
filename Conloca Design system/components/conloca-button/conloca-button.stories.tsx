import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { ConlocaButton } from "./conloca-button"

const meta = {
  title: "Conloca/ConlocaButton",
  component: ConlocaButton,
  tags: ["autodocs"],
  args: {
    children: "Button",
    icon: "plus-02",
    size: "small",
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "iconWithBackground", "iconOnly", "link"],
    },
    size: {
      control: "select",
      options: ["default", "small"],
    },
    icon: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ConlocaButton>

export default meta

type Story = StoryObj<typeof meta>

const playTextButtonHover: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement)
  const button = canvas.getByRole("button", { name: "Button" })

  await userEvent.hover(button)
  await expect(button).toHaveAttribute("data-slot", "conloca-button")
}

const playIconButtonHover: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement)
  await userEvent.hover(canvas.getByRole("button", { name: "Add item" }))
}

const playTextButtonPress: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement)
  const button = canvas.getByRole("button", { name: "Button" })

  await userEvent.pointer({ keys: "[MouseLeft>]", target: button })
  await expect(button).toHaveFocus()
  await userEvent.pointer({ keys: "[/MouseLeft]", target: button })
}

const playIconButtonPress: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement)
  const button = canvas.getByRole("button", { name: "Add item" })

  await userEvent.pointer({ keys: "[MouseLeft>]", target: button })
  await expect(button).toHaveFocus()
  await userEvent.pointer({ keys: "[/MouseLeft]", target: button })
}

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
}

export const IconWithBackground: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconWithBackground",
  },
}

export const IconOnly: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconOnly",
  },
}

export const LinkButton: Story = {
  args: {
    icon: false,
    variant: "link",
  },
}

export const PrimaryHovered: Story = {
  play: playTextButtonHover,
}

export const SecondaryHovered: Story = {
  args: {
    variant: "secondary",
  },
  play: playTextButtonHover,
}

export const IconWithBackgroundHovered: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconWithBackground",
  },
  play: playIconButtonHover,
}

export const IconOnlyHovered: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconOnly",
  },
  play: playIconButtonHover,
}

export const LinkButtonHovered: Story = {
  args: {
    icon: false,
    variant: "link",
  },
  play: playTextButtonHover,
}

export const PrimaryPressed: Story = {
  play: playTextButtonPress,
}

export const SecondaryPressed: Story = {
  args: {
    variant: "secondary",
  },
  play: playTextButtonPress,
}

export const IconWithBackgroundPressed: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconWithBackground",
  },
  play: playIconButtonPress,
}

export const IconOnlyPressed: Story = {
  args: {
    "aria-label": "Add item",
    icon: "plus-02",
    variant: "iconOnly",
  },
  play: playIconButtonPress,
}

export const LinkButtonPressed: Story = {
  args: {
    icon: false,
    variant: "link",
  },
  play: playTextButtonPress,
}

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: "Button" })

    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole("button", { name: "Button" })).toBeDisabled()
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-5 items-center gap-x-10 gap-y-8 bg-[var(--color-bg-sunken-initial)] p-8">
      <ConlocaButton size="small">Button</ConlocaButton>
      <ConlocaButton size="small" variant="secondary">
        Button
      </ConlocaButton>
      <ConlocaButton
        aria-label="Add item"
        icon="plus-02"
        size="small"
        variant="iconWithBackground"
      />
      <ConlocaButton
        aria-label="Add item"
        icon="plus-02"
        size="small"
        variant="iconOnly"
      />
      <ConlocaButton icon={false} size="small" variant="link">
        Button
      </ConlocaButton>

      <ConlocaButton size="default">Button</ConlocaButton>
      <ConlocaButton size="default" variant="secondary">
        Button
      </ConlocaButton>
      <ConlocaButton
        aria-label="Add item"
        icon="plus-02"
        size="default"
        variant="iconWithBackground"
      />
      <ConlocaButton
        aria-label="Add item"
        icon="plus-02"
        size="default"
        variant="iconOnly"
      />
      <ConlocaButton icon={false} size="default" variant="link">
        Button
      </ConlocaButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const iconButtons = canvas.getAllByRole("button", { name: "Add item" })

    await Promise.all(
      iconButtons.slice(2).map(async (button) => {
        const icon = button.querySelector<HTMLElement>(
          "[data-slot='button-icon']",
        )

        await expect(button).toHaveClass("p-[8px]")
        await expect(icon).toHaveStyle({ height: "18px", width: "18px" })
      }),
    )
  },
}
