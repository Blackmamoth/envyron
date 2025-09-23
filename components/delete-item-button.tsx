"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ItemType = "project" | "template";

export function DeleteItemButton({
  id,
  name,
  type,
  onAfterDelete,
  className,
}: {
  id: string;
  name: string;
  type: ItemType;
  className?: string;
  // Optional: parent can pass a callback to remove the item from local state immediately
  onAfterDelete?: () => void;
}) {
  // const { mutate } = useSWRConfig();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      // Try API deletion if available; otherwise this will no-op gracefully.
      await fetch(`/api/${type}s/${id}`, { method: "DELETE" });

      // Optimistically update SWR caches if used by the dashboard lists.
      if (type === "project") {
        // await mutate(
        //   (key: unknown) =>
        //     typeof key === "string" && key.includes("/projects"),
        //   undefined,
        //   {
        //     revalidate: true,
        //   },
        // );
      } else {
        // await mutate(
        //   (key: unknown) =>
        //     typeof key === "string" && key.includes("/templates"),
        //   undefined,
        //   {
        //     revalidate: true,
        //   },
        // );
      }

      // Optional local state removal hook if parent passes one.
      onAfterDelete?.();
    } catch (_) {
      // Silently fail to keep UI minimal; could toast on error if desired.
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Delete ${type} ${name}`}
              className={[
                "ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md",
                "text-muted-foreground hover:text-(--envyron-destructive)",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
                "focus-visible:ring-(--envyron-destructive)",
                className || "",
              ].join(" ")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-sm">
            Delete {type === "project" ? "Project" : "Template"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete {type === "project" ? "Project" : "Template"}
            </DialogTitle>
            <DialogDescription>
              {'Are you sure you want to delete "'}
              {name}
              {'"? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading}
              className="bg-(--envyron-destructive) hover:bg-(--envyron-destructive) hover:opacity-90"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
