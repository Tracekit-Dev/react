import React from 'react';
import { captureException } from '@tracekit/browser';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types';

/**
 * TraceKitErrorBoundary
 *
 * React error boundary that captures render errors with componentStack context
 * and sends them to TraceKit. Renders a user-provided fallback on error.
 *
 * Does NOT re-throw errors -- swallows and shows fallback.
 */
export class TraceKitErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, componentStack: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error, componentStack: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const componentStack = errorInfo.componentStack ?? '';

    captureException(error, {
      componentStack,
      handled: true,
      mechanism: 'react.errorBoundary',
    });

    this.setState({ componentStack });

    this.props.onError?.(error, componentStack);
  }

  resetError = (): void => {
    this.setState({ error: null, componentStack: null });
  };

  render(): React.ReactNode {
    if (this.state.error) {
      const { fallback } = this.props;

      if (typeof fallback === 'function') {
        return fallback(
          this.state.error,
          this.state.componentStack ?? '',
          this.resetError,
        );
      }

      return fallback;
    }

    return this.props.children;
  }
}
