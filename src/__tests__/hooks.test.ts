import { describe, it, expect, vi, beforeEach } from 'vitest';

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
import { traceKitCreateRootOptions } from '../hooks';

describe('traceKitCreateRootOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('onUncaughtError calls captureException with handled: false', () => {
    const options = traceKitCreateRootOptions();
    const error = new Error('uncaught test');

    options.onUncaughtError(error, { componentStack: 'at App' });

    expect(captureException).toHaveBeenCalledWith(error, {
      componentStack: 'at App',
      handled: false,
      mechanism: 'react.onUncaughtError',
    });
  });

  it('onCaughtError calls captureException with handled: true', () => {
    const options = traceKitCreateRootOptions();
    const error = new Error('caught test');

    options.onCaughtError(error, { componentStack: 'at Form' });

    expect(captureException).toHaveBeenCalledWith(error, {
      componentStack: 'at Form',
      handled: true,
      mechanism: 'react.onCaughtError',
    });
  });

  it('onRecoverableError calls captureException with handled: true', () => {
    const options = traceKitCreateRootOptions();
    const error = new Error('recoverable test');

    options.onRecoverableError(error, { componentStack: 'at Layout' });

    expect(captureException).toHaveBeenCalledWith(error, {
      componentStack: 'at Layout',
      handled: true,
      mechanism: 'react.onRecoverableError',
    });
  });

  it('ignores non-Error values', () => {
    const options = traceKitCreateRootOptions();

    options.onUncaughtError('string error', { componentStack: 'stack' });
    options.onCaughtError(42, {});
    options.onRecoverableError(null, {});

    expect(captureException).not.toHaveBeenCalled();
  });
});
