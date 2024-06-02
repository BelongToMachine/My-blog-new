import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const Alter = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isRefReady, setIsRefReady] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current!.click();
    } else console.log("nothing");
  }, []);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <button ref={ref} className="Button violet">
          adbskajdbkadb
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Repository Not Found</AlertDialog.Title>
        <AlertDialog.Description size="2">
          The repository link is not available.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default Alter;
