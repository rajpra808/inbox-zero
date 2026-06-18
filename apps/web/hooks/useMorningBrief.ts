import useSWR from "swr";
import type { GetMorningBriefSettingsResponse } from "@/app/api/user/morning-brief/route";
import type { GetMorningBriefHistoryResponse } from "@/app/api/user/morning-brief/history/route";

export function useMorningBriefSettings() {
  return useSWR<GetMorningBriefSettingsResponse>("/api/user/morning-brief");
}

export function useMorningBriefHistory() {
  return useSWR<GetMorningBriefHistoryResponse>(
    "/api/user/morning-brief/history",
  );
}
