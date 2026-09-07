import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { ConlocaButton } from "@conloca-design-system/components/conloca-button"
import {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
  ConlocaDialogTrigger,
} from "./conloca-dialog"

const previewButton = <ConlocaButton icon={false} />

const meta = {
  title: "Conloca/ConlocaDialog",
  component: ConlocaDialogContent,
  tags: ["autodocs"],
  args: { closeLabel: "Close preview" },
  argTypes: { closeLabel: { control: "text" }, className: { control: "text" } },
  render: (args) => (
    <ConlocaDialog>
      <ConlocaDialogTrigger render={previewButton}>
        Open preview
      </ConlocaDialogTrigger>
      <ConlocaDialogContent {...args}>
        <ConlocaDialogTitle>Video preview</ConlocaDialogTitle>
        <div className="mt-4 aspect-video rounded-xl bg-[var(--color-bg-sunken-initial)]" />
      </ConlocaDialogContent>
    </ConlocaDialog>
  ),
} satisfies Meta<typeof ConlocaDialogContent>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const AllVariants: Story = {}
export const KeyboardDismissal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Open preview" })
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    await expect(
      body.getByRole("dialog", { name: "Video preview" }),
    ).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect(trigger).toHaveFocus()
  },
}
