import React, { forwardRef, MutableRefObject } from "react"
import { Callout, Button } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"

interface DialogProps {
  message: string
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ message }, ref) => (
    <dialog
      ref={ref as MutableRefObject<HTMLDialogElement>}
      className="rounded-xl border border-[var(--border-color)] bg-[var(--card-background-color)] p-4 text-[var(--text-color)] shadow-lg backdrop:bg-[rgba(8,12,18,0.66)]"
    >
      <div className="rounded-md">
        <Callout.Root color="amber" variant="surface">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{message}</Callout.Text>
        </Callout.Root>
      </div>
      {ref && (
        <Button
          onClick={() =>
            (ref as MutableRefObject<HTMLDialogElement>).current.close()
          }
          mt="4"
          variant="soft"
        >
          关闭
        </Button>
      )}
    </dialog>
  )
)

Dialog.displayName = "Dialog"

export default Dialog
