"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useNavigationContext } from "./navigation-provider";
import {
  getNavigationTransitionType,
  type NavigationDescriptor,
} from "./types";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "onNavigate"> &
  NavigationDescriptor;

export function AppLink({
  intent,
  source,
  fallback,
  ...linkProps
}: AppLinkProps) {
  const { prepareNavigation } = useNavigationContext();

  return (
    <Link
      {...linkProps}
      transitionTypes={[getNavigationTransitionType(intent)]}
      onNavigate={() => prepareNavigation({ intent, source, fallback })}
    />
  );
}
