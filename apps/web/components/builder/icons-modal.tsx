"use client";

import { useState, useMemo } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EMOJI_DATA } from "./emoji-data";

export function IconsModal() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const entries = useMemo(() => {
    const all = Object.entries(EMOJI_DATA);
    if (!search.trim()) return all;
    const q = search.toLowerCase().trim();
    return all.filter(([name]) => name.includes(q));
  }, [search]);

  function handleCopy(name: string) {
    navigator.clipboard.writeText(`:${name}:`);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Smile className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Emoji</DialogTitle>
          <DialogDescription>
            Search and click to copy the <code>:shortcode:</code> syntax.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-2 flex flex-col gap-2 min-h-0">
          <Input
            placeholder="Search emoji..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
          <div className="overflow-y-auto max-h-[50vh] grid grid-cols-6 gap-0.5">
            {entries.length === 0 ? (
              <p className="col-span-6 text-center text-sm text-muted-foreground py-8">
                No emoji found for &ldquo;{search}&rdquo;
              </p>
            ) : (
              entries.map(([name, emoji]) => (
                <button
                  key={name}
                  onClick={() => handleCopy(name)}
                  className="flex flex-col items-center gap-0.5 rounded-md p-1.5 text-center transition-colors hover:bg-muted/50"
                  title={`:${name}:`}
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  {copied === name ? (
                    <span className="text-[10px] text-green-600 font-medium">
                      Copied!
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground truncate w-full">
                      {name}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
