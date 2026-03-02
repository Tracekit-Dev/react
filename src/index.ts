/**
 * @tracekit/react
 *
 * React integration for the TraceKit Browser SDK.
 * Provides ErrorBoundary, React 19 createRoot hooks, and React Router breadcrumbs.
 *
 * Re-exports core SDK functions for single-import convenience:
 *   import { init, captureException, TraceKitErrorBoundary } from '@tracekit/react';
 */

// Re-export core SDK functions for single-import setup
export {
  init,
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
} from '@tracekit/browser';

// React-specific exports
export { TraceKitErrorBoundary } from './errorboundary';
export { traceKitCreateRootOptions } from './hooks';
export { TraceKitRouterBreadcrumbs } from './router';

// Types
export type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  RouterBreadcrumbsProps,
} from './types';
