"use client";

import { ViewTransition, type ReactNode, type ViewTransitionClass } from "react";
import { useNavigationContext } from "./navigation-provider";

const PAGE_TRANSITION_CLASSES = {
  "nav-forward": "nav-page-forward",
  "nav-back": "nav-page-back",
  "nav-flow-exit": "nav-page-flow-exit",
  "nav-flow-completion": "nav-page-flow-completion",
  default: "none",
} satisfies ViewTransitionClass;

export function NavigationShell({ children }: { children: ReactNode }) {
  const { routeMetadata } = useNavigationContext();

  return (
    <ViewTransition default="none" update={PAGE_TRANSITION_CLASSES}>
      <div
        className="navigation-page-surface"
        data-navigation-shell=""
        data-route-id={routeMetadata.id}
        data-swipe-allowed={routeMetadata.swipeAllowed ? "true" : "false"}
      >
        {children}
      </div>
    </ViewTransition>
  );
}
