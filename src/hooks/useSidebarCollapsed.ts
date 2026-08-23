"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sidebar:collapsed";
const DESKTOP_QUERY = "(min-width: 1024px)";

type Listener = () => void;

const listeners = new Set<Listener>();
let collapsedState = false;
let hydratedFromStorage = false;

function readStoredCollapsed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // storage unavailable (private mode) — keep the expanded default
    return false;
  }
}

function subscribeCollapsed(listener: Listener) {
  // First subscriber pulls the persisted value; runs after hydration so the
  // server and client first render agree on the expanded default.
  if (!hydratedFromStorage) {
    hydratedFromStorage = true;
    collapsedState = readStoredCollapsed();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setCollapsed(next: boolean) {
  collapsedState = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // ignore
  }
  listeners.forEach((listener) => listener());
}

function subscribeDesktop(listener: Listener) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}

/**
 * Rail state for the dashboard sidebar.
 * Persisted in localStorage and only applied on desktop — the mobile drawer
 * always renders the full-width sidebar with labels.
 */
export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    () => collapsedState,
    () => false
  );

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );

  const toggle = useCallback(() => setCollapsed(!collapsedState), []);

  return { isCollapsed: collapsed && isDesktop, isDesktop, toggle };
}
