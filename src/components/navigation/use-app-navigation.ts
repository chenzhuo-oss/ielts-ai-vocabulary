"use client";

import { useCallback } from "react";
import { useNavigationContext } from "./navigation-provider";
import type { NavigateOptions } from "./types";

export function useAppNavigation() {
  const context = useNavigationContext();
  const { navigate } = context;

  const navigateForward = useCallback(
    (href: string, options?: NavigateOptions) =>
      navigate(href, "forward", options),
    [navigate],
  );
  const navigateBack = useCallback(
    (href: string, options?: NavigateOptions) =>
      navigate(href, "back", options),
    [navigate],
  );
  const navigateFlowExit = useCallback(
    (href: string, options?: NavigateOptions) =>
      navigate(href, "flow-exit", options),
    [navigate],
  );
  const navigateFlowCompletion = useCallback(
    (href: string, options?: NavigateOptions) =>
      navigate(href, "flow-completion", options),
    [navigate],
  );

  return {
    ...context,
    navigateForward,
    navigateBack,
    navigateFlowExit,
    navigateFlowCompletion,
  };
}
