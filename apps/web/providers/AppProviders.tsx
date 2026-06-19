"use client";

import type React from "react";
import { Provider } from "jotai";
import { ComposeModalProvider } from "@/providers/ComposeModalProvider";
import { jotaiStore } from "@/store";
import { ChatProvider } from "@/providers/ChatProvider";

export function AppProviders(props: { children: React.ReactNode }) {
  return (
    <Provider store={jotaiStore}>
      <ChatProvider>
        <ComposeModalProvider>{props.children}</ComposeModalProvider>
      </ChatProvider>
    </Provider>
  );
}
