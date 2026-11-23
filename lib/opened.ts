"use client";

import { useSyncExternalStore } from "react";

export const OPENED_EVENT = "invite:opened";

const subscribe = (cb: () => void) => {
  window.addEventListener(OPENED_EVENT, cb);
  return () => window.removeEventListener(OPENED_EVENT, cb);
};

/** True once the guest has opened the envelope (or skipped it this session).
 *  The source of truth is the `opened` class the boot script / gate puts on <html>. */
export function useInviteOpened(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("opened"),
    () => false,
  );
}
