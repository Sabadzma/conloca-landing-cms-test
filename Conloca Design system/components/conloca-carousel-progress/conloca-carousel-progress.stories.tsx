import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { ConlocaCarouselProgress } from "./conloca-carousel-progress"

const meta = {
  title: "Conloca/ConlocaCarouselProgress",
  component: ConlocaCarouselProgress,
  tags: ["autodocs"],
  args: { active: true, value: 40, "aria-label": "Slide progress" },
  argTypes: {
    active: { control: "boolean" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    className: { control: "text" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConlocaCarouselProgress>
export default meta
type Story = StoryObj<typeof meta>
export const Active: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("progressbar"),
    ).toHaveAttribute("aria-valuenow", "40")
  },
}
export const Inactive: Story = { args: { active: false } }
export const Empty: Story = { args: { value: 0 } }
export const Halfway: Story = { args: { value: 50 } }
export const Complete: Story = {
  args: { value: 100 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("progressbar"),
    ).toHaveAttribute("aria-valuenow", "100")
  },
}
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ConlocaCarouselProgress aria-label="Active slide" />
      <ConlocaCarouselProgress active={false} aria-label="Inactive slide" />
      <ConlocaCarouselProgress value={0} aria-label="Starting slide" />
      <ConlocaCarouselProgress value={50} aria-label="Halfway through slide" />
      <ConlocaCarouselProgress value={100} aria-label="Complete slide" />
    </div>
  ),
}
