"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { FeedEvent, FeedPost } from "@/lib/types";

type PostCardProps = {
  post: FeedPost | FeedEvent;
  onMarkAsTask?: (post: FeedPost) => void;
};

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function PostCard({ post, onMarkAsTask }: PostCardProps) {
  const [likes, setLikes] = useState(post.kind === "post" ? post.likes : 0);
  const [liked, setLiked] = useState(false);

  function toggleLike() {
    if (post.kind !== "post") {
      return;
    }
    setLiked((previous) => !previous);
    setLikes((previous) => (liked ? previous - 1 : previous + 1));
  }

  if (post.kind === "event") {
    return (
      <Card className="space-y-2 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-text-secondary">Evento</p>
        <p className="text-base text-text-primary">{post.content}</p>
        <p className="text-sm text-text-secondary">
          {post.author} - {post.timestamp}
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 p-6 transition-shadow duration-200 hover:shadow-lift">
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-semibold text-brand-primary"
          aria-hidden="true"
        >
          {buildInitials(post.author)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-base font-medium text-text-primary">{post.author}</p>
            <p className="text-sm text-text-secondary">{post.role}</p>
            <span className="text-sm text-text-secondary">-</span>
            <p className="text-sm text-text-secondary">{post.timestamp}</p>
          </div>
          <p className="mt-2 text-base leading-7 text-text-primary">{post.content}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line pt-3 text-sm">
        <button
          type="button"
          className="rounded-lg px-2.5 py-1.5 text-text-secondary transition-colors hover:bg-[#f3f7fa] hover:text-text-primary"
        >
          Comentar ({post.comments})
        </button>

        <button
          type="button"
          onClick={toggleLike}
          className={cn(
            "rounded-lg px-2.5 py-1.5 transition-colors hover:bg-[#f3f7fa]",
            liked ? "text-state-info" : "text-text-secondary hover:text-text-primary"
          )}
        >
          Me gusta ({likes})
        </button>

        <button
          type="button"
          onClick={() => onMarkAsTask?.(post)}
          className="rounded-lg px-2.5 py-1.5 text-text-secondary transition-colors hover:bg-[#f3f7fa] hover:text-text-primary"
        >
          Convertir en tarea
        </button>
      </div>
    </Card>
  );
}
