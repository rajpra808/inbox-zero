"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/Loading";
import { ChevronsDownIcon } from "lucide-react";
import type { UnifiedInboxThread } from "@/app/api/unified-inbox/validation";

export function UnifiedInboxList({
  threads,
  showLoadMore,
  isLoadingMore,
  handleLoadMore,
}: {
  threads: UnifiedInboxThread[];
  showLoadMore?: boolean;
  isLoadingMore?: boolean;
  handleLoadMore?: () => void;
}) {
  if (threads.length === 0) {
    return (
      <div className="mt-20 flex items-center justify-center font-title text-2xl text-primary">
        No emails to display
      </div>
    );
  }

  return (
    <ul className="min-w-0 divide-y divide-border overflow-x-hidden">
      {threads.map((thread) => {
        const initial = (thread.fromName || thread.from || "?")
          .charAt(0)
          .toUpperCase();
        return (
          <li key={thread.id}>
            <Link
              href={`/${thread.emailAccountId}/mail?thread-id=${thread.threadId}`}
              className="flex gap-3 px-4 py-3 hover:bg-muted/50"
            >
              <Avatar className="h-9 w-9">
                {thread.account.image ? (
                  <AvatarImage src={thread.account.image} alt="" />
                ) : null}
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`truncate text-sm ${thread.read ? "text-muted-foreground" : "font-semibold"}`}
                  >
                    {thread.fromName || thread.from}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <div
                  className={`truncate text-sm ${thread.read ? "text-muted-foreground" : "font-medium"}`}
                >
                  {thread.subject || "(no subject)"}
                </div>

                {thread.snippet ? (
                  <div className="truncate text-xs text-muted-foreground">
                    {thread.snippet}
                  </div>
                ) : null}

                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {thread.account.email}
                  </Badge>
                  {thread.category ? (
                    <Badge variant="outline" className="text-xs font-normal">
                      {thread.category}
                    </Badge>
                  ) : null}
                  {!thread.read ? (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
      {showLoadMore && (
        <Button
          variant="outline"
          className="mb-2 w-full"
          size="sm"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? (
            <ButtonLoader />
          ) : (
            <ChevronsDownIcon className="mr-2 h-4 w-4" />
          )}
          <span>Load more</span>
        </Button>
      )}
    </ul>
  );
}
