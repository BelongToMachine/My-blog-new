import React, { forwardRef, MutableRefObject } from "react";
import { Callout, Text } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface DialogProps {
  message: string;
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ message }, ref) => (
    <dialog
      ref={ref as MutableRefObject<HTMLDialogElement>}
      className="p-4 rounded-md shadow-lg"
    >
      <div className="bg-yellow-200 rounded-md">
        <Callout.Root color="yellow">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{message}</Callout.Text>
        </Callout.Root>
      </div>
      {ref && (
        <button
          onClick={() =>
            (ref as MutableRefObject<HTMLDialogElement>).current.close()
          }
          className="mt-4 p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded"
        >
          关闭
        </button>
      )}
    </dialog>
  )
);

Dialog.displayName = "Dialog";

export default Dialog;
