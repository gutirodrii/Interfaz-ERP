"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PostComposerProps = {
  authorName: string;
  onSubmitPost: (content: string) => void;
};

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function PostComposer({ authorName, onSubmitPost }: PostComposerProps) {
  const [content, setContent] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedContent = content.trim();
    if (!normalizedContent) {
      return;
    }

    onSubmitPost(normalizedContent);
    setContent("");
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary/15 text-sm font-semibold text-brand-secondary"
            aria-hidden="true"
          >
            {buildInitials(authorName)}
          </span>

          <label htmlFor="new-post" className="sr-only">
            Publicar actualizacion
          </label>
          <textarea
            id="new-post"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            placeholder="Que esta pasando en tu equipo?"
            className="min-h-[90px] w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-base text-text-primary shadow-sm placeholder:text-text-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-info focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="h-11 w-auto px-6">
            Publicar
          </Button>
        </div>
      </form>
    </Card>
  );
}
