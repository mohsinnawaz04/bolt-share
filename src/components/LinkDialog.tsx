"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function LinkDialog({
  shareableLink,
  isOpen,
  setOpen,
}: {
  shareableLink: string;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [btnLabel, setBtnLabel] = useState("Copy");

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard");
      setBtnLabel("Copied");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast("Error, couldn't copy due to unknown error");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={shareableLink || "Link cannot be generated"}
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => copyToClipboard(shareableLink)}
          >
            {btnLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
