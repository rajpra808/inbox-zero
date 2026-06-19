"use client";

import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";
import { LoadingContent } from "@/components/LoadingContent";
import { PermissionsCheck } from "@/app/(app)/[emailAccountId]/PermissionsCheck";
import { UnifiedInboxList } from "@/components/email-list/UnifiedInboxList";
import type { UnifiedInboxResponse } from "@/app/api/unified-inbox/validation";

export default function UnifiedInboxPage() {
  const getKey = (
    pageIndex: number,
    previousPageData: UnifiedInboxResponse | null,
  ) => {
    if (previousPageData && !previousPageData.nextCursor) return null;

    const params = new URLSearchParams();
    if (pageIndex > 0 && previousPageData?.nextCursor) {
      params.set("cursor", previousPageData.nextCursor);
    }

    const qs = params.toString();
    return `/api/unified-inbox${qs ? `?${qs}` : ""}`;
  };

  const { data, size, setSize, isLoading, error } =
    useSWRInfinite<UnifiedInboxResponse>(getKey, {
      keepPreviousData: true,
      dedupingInterval: 1000,
      revalidateOnFocus: false,
    });

  const allThreads = data ? data.flatMap((page) => page.threads) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const showLoadMore = data ? !!data[data.length - 1]?.nextCursor : false;

  const handleLoadMore = useCallback(() => {
    setSize((s) => s + 1);
  }, [setSize]);

  return (
    <PageWrapper>
      <PageHeader title="Unified Inbox" />
      <PermissionsCheck />
      <LoadingContent loading={isLoading && !data} error={error}>
        <UnifiedInboxList
          threads={allThreads}
          showLoadMore={showLoadMore}
          isLoadingMore={isLoadingMore}
          handleLoadMore={handleLoadMore}
        />
      </LoadingContent>
    </PageWrapper>
  );
}
