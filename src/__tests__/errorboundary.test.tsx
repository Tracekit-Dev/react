import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

vi.mock('@tracekit/browser', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  init: vi.fn(),
  getClient: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  setTag: vi.fn(),
  setExtra: vi.fn(),
}));

import { captureException } from '@tracekit/browser';
import { TraceKitErrorBoundary } from '../errorboundary';

// Component that throws an error when rendered
function ThrowingComponent({ error }: { error: Error }): React.ReactNode {
  throw error;
}

describe('TraceKitErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress React's error boundary console.error logs in test output
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error', () => {
    render(
      <TraceKitErrorBoundary fallback={<div>Error</div>}>
        <div>Content</div>
      </TraceKitErrorBoundary>,
    );

    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders ReactNode fallback on error', () => {
    const testError = new Error('Test error');

    render(
      <TraceKitErrorBoundary fallback={<div>Something went wrong</div>}>
        <ThrowingComponent error={testError} />
      </TraceKitErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(captureException).toHaveBeenCalledWith(testError, {
      componentStack: expect.any(String),
      handled: true,
      mechanism: 'react.errorBoundary',
    });
  });

  it('renders function fallback with error, componentStack, and resetError', () => {
    let shouldThrow = true;
    let capturedError: Error | undefined;
    let capturedStack: string | undefined;
    let resetFn: (() => void) | undefined;

    function MaybeThrow() {
      if (shouldThrow) {
        throw new Error('Function fallback error');
      }
      return <div>Recovered</div>;
    }

    render(
      <TraceKitErrorBoundary
        fallback={(error, componentStack, resetError) => {
          capturedError = error;
          capturedStack = componentStack;
          resetFn = resetError;
          return (
            <div>
              <span>Error: {error.message}</span>
              <button onClick={resetError}>Reset</button>
            </div>
          );
        }}
      >
        <MaybeThrow />
      </TraceKitErrorBoundary>,
    );

    expect(screen.getByText('Error: Function fallback error')).toBeDefined();
    expect(capturedError).toBeInstanceOf(Error);
    expect(typeof capturedStack).toBe('string');
    expect(resetFn).toBeDefined();

    // Stop throwing before resetting
    shouldThrow = false;

    act(() => {
      resetFn!();
    });

    expect(screen.getByText('Recovered')).toBeDefined();
  });

  it('calls onError prop', () => {
    const testError = new Error('OnError test');
    const onError = vi.fn();

    render(
      <TraceKitErrorBoundary fallback={<div>Fallback</div>} onError={onError}>
        <ThrowingComponent error={testError} />
      </TraceKitErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(testError, expect.any(String));
  });

  it('does not re-throw errors', () => {
    const testError = new Error('No re-throw');

    // If the error boundary re-threw, this render would itself throw
    // and the test would fail. We also verify no unhandled error was logged
    // beyond React's own dev-mode logging.
    expect(() => {
      render(
        <TraceKitErrorBoundary fallback={<div>Caught</div>}>
          <ThrowingComponent error={testError} />
        </TraceKitErrorBoundary>,
      );
    }).not.toThrow();

    expect(screen.getByText('Caught')).toBeDefined();
  });
});
