"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";
import { SettingCard } from "@/components/SettingCard";
import { Toggle } from "@/components/Toggle";
import { toastSuccess, toastError } from "@/components/Toast";
import { LoadingContent } from "@/components/LoadingContent";
import { PremiumAlertWithData } from "@/components/PremiumAlert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAction } from "next-safe-action/hooks";
import {
  updateMorningBriefSettingsAction,
  sendTestMorningBriefAction,
} from "@/utils/actions/morning-brief";
import {
  useMorningBriefSettings,
  useMorningBriefHistory,
} from "@/hooks/useMorningBrief";
import { DAYS } from "@/utils/schedule";
import { getActionErrorMessage } from "@/utils/error";

const DAY_LABELS: Array<{ key: keyof typeof DAYS; label: string }> = [
  { key: "SUNDAY", label: "S" },
  { key: "MONDAY", label: "M" },
  { key: "TUESDAY", label: "T" },
  { key: "WEDNESDAY", label: "W" },
  { key: "THURSDAY", label: "T" },
  { key: "FRIDAY", label: "F" },
  { key: "SATURDAY", label: "S" },
];

function timeString(hours: number, minutes: number) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export default function MorningBriefPage() {
  const { data, isLoading, error, mutate } = useMorningBriefSettings();
  const { data: historyData, mutate: mutateHistory } = useMorningBriefHistory();

  const [hours, setHours] = useState(data?.hours ?? 8);
  const [minutes, setMinutes] = useState(data?.minutes ?? 0);
  const [daysOfWeek, setDaysOfWeek] = useState(data?.daysOfWeek ?? 127);

  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateMorningBriefSettingsAction,
    {
      onSuccess: () => {
        toastSuccess({ description: "Settings saved!" });
        mutate();
      },
      onError: ({ error }) => {
        toastError({ description: getActionErrorMessage(error) });
      },
    },
  );

  const { execute: executeTest, status: testStatus } = useAction(
    sendTestMorningBriefAction,
    {
      onSuccess: () => {
        toastSuccess({ description: "Test brief sent!" });
        mutateHistory();
      },
      onError: ({ error }) => {
        toastError({ description: getActionErrorMessage(error) });
      },
    },
  );

  const enabled = data?.enabled ?? false;

  const toggleDay = (mask: number) => {
    setDaysOfWeek((d) => d ^ mask);
  };

  const onTimeChange = (value: string) => {
    const [h, m] = value.split(":").map(Number);
    setHours(h);
    setMinutes(m);
  };

  const saveSchedule = (nextEnabled: boolean) => {
    executeUpdate({
      enabled: nextEnabled,
      hours,
      minutes,
      daysOfWeek,
    });
  };

  return (
    <PageWrapper>
      <PageHeader title="Morning Brief" />

      <div className="mt-4 max-w-3xl space-y-4">
        <PremiumAlertWithData />

        <LoadingContent loading={isLoading} error={error}>
          <div className="space-y-2">
            <SettingCard
              title="Enable Morning Brief"
              description="A daily summary of important new emails across all your connected accounts."
              right={
                <Toggle
                  name="enabled"
                  enabled={enabled}
                  onChange={(value) => saveSchedule(value)}
                  disabled={updateStatus === "executing"}
                />
              }
            />

            {enabled && (
              <>
                <SettingCard
                  title="Delivery time"
                  description="When to receive your morning brief"
                  collapseOnMobile
                  right={
                    <input
                      type="time"
                      value={timeString(hours, minutes)}
                      onChange={(e) => onTimeChange(e.target.value)}
                      className="rounded border border-border bg-background px-2 py-1 text-sm"
                    />
                  }
                />

                <SettingCard
                  title="Days of week"
                  description="Which days to receive the brief"
                  collapseOnMobile
                  right={
                    <div className="flex gap-1">
                      {DAY_LABELS.map(({ key, label }) => {
                        const active = (daysOfWeek & DAYS[key]) !== 0;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => toggleDay(DAYS[key])}
                            className={`h-8 w-8 rounded-full text-xs font-medium ${
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  }
                />

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => executeTest({})}
                    disabled={testStatus === "executing"}
                  >
                    {testStatus === "executing"
                      ? "Sending..."
                      : "Send test brief"}
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => saveSchedule(true)}
                  disabled={updateStatus === "executing"}
                >
                  {updateStatus === "executing" ? "Saving..." : "Save schedule"}
                </Button>
              </>
            )}
          </div>
        </LoadingContent>

        {enabled && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Recent briefs</h2>
            <LoadingContent loading={!historyData} error={null}>
              <div className="space-y-4">
                {historyData?.briefs.map((brief) => (
                  <div
                    key={brief.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">
                        {brief.sentAt
                          ? new Date(brief.sentAt).toLocaleString()
                          : "Pending"}
                      </Badge>
                      <Badge
                        variant={
                          brief.status === "SENT" ? "default" : "outline"
                        }
                      >
                        {brief.status}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-foreground">
                      {brief.executiveSummary}
                    </p>
                    <ul className="space-y-2">
                      {brief.items.map((item) => (
                        <li key={item.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.from}</span>
                            {item.actionNeeded && (
                              <Badge variant="destructive" className="text-xs">
                                Action needed
                              </Badge>
                            )}
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {item.subject}
                          </p>
                          <p className="text-muted-foreground">
                            {item.summary}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {historyData?.briefs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No briefs yet. Send a test brief to see it here.
                  </p>
                )}
              </div>
            </LoadingContent>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
