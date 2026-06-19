"use client";

import useSWR from "swr";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EmailPanel } from "@/components/email-list/EmailPanel";
import { LoadingContent } from "@/components/LoadingContent";
import type { ThreadResponse } from "@/app/api/threads/[id]/route";

export function UnifiedInboxThreadViewer({
  threadId,
  emailAccountId,
  onClose,
}: {
  threadId: string | null;
  emailAccountId: string | null;
  onClose: () => void;
}) {
  const { data, error, isLoading, mutate } = useSWR<ThreadResponse>(
    threadId && emailAccountId
      ? [`/api/threads/${threadId}`, emailAccountId]
      : null,
  );

  return (
    <Sheet open={!!threadId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        size="5xl"
        className="w-full sm:w-[800px] p-0 sm:max-w-none"
      >
        <LoadingContent loading={isLoading} error={error}>
          {data?.thread && (
            <EmailPanel
              row={data.thread}
              onPlanAiAction={() => {}}
              onArchive={() => {}}
              advanceToAdjacentThread={() => {}}
              close={onClose}
              refetch={() => mutate()}
            />
          )}
        </LoadingContent>
      </SheetContent>
    </Sheet>
  );
}
