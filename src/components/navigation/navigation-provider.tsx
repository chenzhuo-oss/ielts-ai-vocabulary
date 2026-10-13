"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getRouteMetadata } from "./route-metadata";
import { getNavigationTransitionType } from "./types";
import type {
  NavigateOptions,
  NavigationDescriptor,
  NavigationIntent,
  NavigationSource,
  RouteMetadata,
} from "./types";

type ExitGuard = () => void;

type NavigationContextValue = {
  currentIntent: NavigationIntent | null;
  currentPathname: string;
  currentSource?: NavigationSource;
  currentFallback?: string;
  routeMetadata: RouteMetadata;
  prepareNavigation: (descriptor: NavigationDescriptor) => void;
  navigate: (
    href: string,
    intent: NavigationIntent,
    options?: NavigateOptions,
  ) => void;
  registerExitGuard: (guard: ExitGuard) => () => void;
  requestExit: () => boolean;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const exitGuardRef = useRef<ExitGuard | null>(null);
  const [descriptor, setDescriptor] = useState<NavigationDescriptor | null>(null);

  const prepareNavigation = useCallback((next: NavigationDescriptor) => {
    setDescriptor(next);
  }, []);

  const navigate = useCallback(
    (
      href: string,
      intent: NavigationIntent,
      options: NavigateOptions = {},
    ) => {
      setDescriptor({
        intent,
        source: options.source,
        fallback: options.fallback,
      });
      const routerOptions = {
        scroll: options.scroll,
        transitionTypes: [getNavigationTransitionType(intent)],
      };
      if (options.replace) {
        router.replace(href, routerOptions);
      } else {
        router.push(href, routerOptions);
      }
    },
    [router],
  );

  const registerExitGuard = useCallback((guard: ExitGuard) => {
    exitGuardRef.current = guard;
    return () => {
      if (exitGuardRef.current === guard) exitGuardRef.current = null;
    };
  }, []);

  const requestExit = useCallback(() => {
    if (!exitGuardRef.current) return false;
    exitGuardRef.current();
    return true;
  }, []);

  const routeMetadata = useMemo(() => getRouteMetadata(pathname), [pathname]);
  const value = useMemo<NavigationContextValue>(
    () => ({
      currentIntent: descriptor?.intent ?? null,
      currentPathname: pathname,
      currentSource: descriptor?.source,
      currentFallback: descriptor?.fallback,
      routeMetadata,
      prepareNavigation,
      navigate,
      registerExitGuard,
      requestExit,
    }),
    [
      descriptor,
      navigate,
      pathname,
      prepareNavigation,
      registerExitGuard,
      requestExit,
      routeMetadata,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationContext must be used within NavigationProvider");
  }
  return context;
}
