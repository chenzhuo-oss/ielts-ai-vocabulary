export type NavigationIntent =
  | "forward"
  | "back"
  | "flow-exit"
  | "flow-completion";

export type NavigationTransitionType =
  | "nav-forward"
  | "nav-back"
  | "nav-flow-exit"
  | "nav-flow-completion";

const NAVIGATION_TRANSITION_TYPES: Record<
  NavigationIntent,
  NavigationTransitionType
> = {
  forward: "nav-forward",
  back: "nav-back",
  "flow-exit": "nav-flow-exit",
  "flow-completion": "nav-flow-completion",
};

export function getNavigationTransitionType(
  intent: NavigationIntent,
): NavigationTransitionType {
  return NAVIGATION_TRANSITION_TYPES[intent];
}

export type NavigationSource =
  | "home"
  | "learn-main"
  | "learn-extra"
  | "word-detail-learning"
  | "word-detail-browse"
  | "ai-assistant"
  | "pack-detail"
  | "vocabulary-list"
  | "completion"
  | "extra-completion";

export type RouteFlowType =
  | "root"
  | "standard"
  | "learning"
  | "completion";

export type RouteMetadata = {
  id:
    | "home"
    | "learn"
    | "word-detail"
    | "ai-assistant"
    | "pack-detail"
    | "vocabulary-list"
    | "completion"
    | "development"
    | "unknown";
  semanticLevel: number;
  defaultBackTarget: string | null;
  swipeAllowed: boolean;
  flowType: RouteFlowType;
  root: boolean;
};

export type NavigationDescriptor = {
  intent: NavigationIntent;
  source?: NavigationSource;
  fallback?: string;
};

export type NavigateOptions = Omit<NavigationDescriptor, "intent"> & {
  replace?: boolean;
  scroll?: boolean;
};
