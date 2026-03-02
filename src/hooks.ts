import { captureException } from '@tracekit/browser';

/**
 * Returns an options object for React 19's `createRoot()` with error callbacks
 * that automatically capture errors via TraceKit.
 *
 * Usage:
 *   import { createRoot } from 'react-dom/client';
 *   import { traceKitCreateRootOptions } from '@tracekit/react';
 *
 *   const root = createRoot(document.getElementById('root')!, {
 *     ...traceKitCreateRootOptions(),
 *   });
 *
 * React 18 will simply ignore unknown options, so this is safe to use
 * regardless of React version.
 */
export function traceKitCreateRootOptions(): {
  onUncaughtError: (error: unknown, errorInfo: { componentStack?: string }) => void;
  onCaughtError: (error: unknown, errorInfo: { componentStack?: string }) => void;
  onRecoverableError: (error: unknown, errorInfo: { componentStack?: string }) => void;
} {
  return {
    onUncaughtError(error: unknown, errorInfo: { componentStack?: string }): void {
      if (error instanceof Error) {
        captureException(error, {
          componentStack: errorInfo.componentStack,
          handled: false,
          mechanism: 'react.onUncaughtError',
        });
      }
    },

    onCaughtError(error: unknown, errorInfo: { componentStack?: string }): void {
      if (error instanceof Error) {
        captureException(error, {
          componentStack: errorInfo.componentStack,
          handled: true,
          mechanism: 'react.onCaughtError',
        });
      }
    },

    onRecoverableError(error: unknown, errorInfo: { componentStack?: string }): void {
      if (error instanceof Error) {
        captureException(error, {
          componentStack: errorInfo.componentStack,
          handled: true,
          mechanism: 'react.onRecoverableError',
        });
      }
    },
  };
}
