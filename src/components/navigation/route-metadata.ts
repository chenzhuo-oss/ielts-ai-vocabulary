import type { RouteMetadata } from "./types";

const HOME_METADATA: RouteMetadata = {
  id: "home",
  semanticLevel: 0,
  defaultBackTarget: null,
  swipeAllowed: false,
  flowType: "root",
  root: true,
};

export function getRouteMetadata(pathname: string): RouteMetadata {
  if (pathname === "/") return HOME_METADATA;

  if (pathname === "/learn") {
    return {
      id: "learn",
      semanticLevel: 1,
      defaultBackTarget: "/",
      swipeAllowed: true,
      flowType: "learning",
      root: false,
    };
  }

  if (pathname.startsWith("/words/")) {
    return {
      id: "word-detail",
      semanticLevel: 2,
      defaultBackTarget: "/",
      swipeAllowed: true,
      flowType: "standard",
      root: false,
    };
  }

  if (pathname === "/ai-assistant") {
    return {
      id: "ai-assistant",
      semanticLevel: 3,
      defaultBackTarget: "/",
      swipeAllowed: true,
      flowType: "standard",
      root: false,
    };
  }

  if (pathname === "/complete") {
    return {
      id: "completion",
      semanticLevel: 1,
      defaultBackTarget: "/",
      swipeAllowed: false,
      flowType: "completion",
      root: false,
    };
  }

  if (/^\/packs\/[^/]+\/words$/.test(pathname)) {
    const packPath = pathname.slice(0, -"/words".length);
    return {
      id: "vocabulary-list",
      semanticLevel: 2,
      defaultBackTarget: packPath,
      swipeAllowed: true,
      flowType: "standard",
      root: false,
    };
  }

  if (/^\/packs\/[^/]+$/.test(pathname)) {
    return {
      id: "pack-detail",
      semanticLevel: 1,
      defaultBackTarget: "/",
      swipeAllowed: true,
      flowType: "standard",
      root: false,
    };
  }

  if (pathname.startsWith("/dev/")) {
    return {
      id: "development",
      semanticLevel: 0,
      defaultBackTarget: "/",
      swipeAllowed: false,
      flowType: "standard",
      root: false,
    };
  }

  return {
    id: "unknown",
    semanticLevel: 0,
    defaultBackTarget: "/",
    swipeAllowed: false,
    flowType: "standard",
    root: false,
  };
}
