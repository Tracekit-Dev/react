import type { ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback:
    | ReactNode
    | ((error: Error, componentStack: string, resetError: () => void) => ReactNode);
  onError?: (error: Error, componentStack: string) => void;
}

export interface ErrorBoundaryState {
  error: Error | null;
  componentStack: string | null;
}

export interface RouterBreadcrumbsProps {
  /** Whether to use parameterized route paths (default: true) */
  parameterizedRoutes?: boolean;
}
