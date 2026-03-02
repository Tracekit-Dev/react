import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock @tracekit/browser
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

// Mock react-router's useLocation
const mockLocation = { pathname: '/', search: '', hash: '', state: null, key: 'default', unstable_mask: undefined };
vi.mock('react-router', () => ({
  useLocation: vi.fn(() => mockLocation),
}));

import { addBreadcrumb } from '@tracekit/browser';
import { useLocation } from 'react-router';
import { TraceKitRouterBreadcrumbs } from '../router';

const mockUseLocation = vi.mocked(useLocation);

describe('TraceKitRouterBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
      unstable_mask: undefined,
    } as ReturnType<typeof useLocation>);
  });

  it('adds breadcrumb on location change', () => {
    // Initial render at /
    const { rerender } = render(<TraceKitRouterBreadcrumbs />);

    expect(addBreadcrumb).not.toHaveBeenCalled();

    // Navigate to /about
    mockUseLocation.mockReturnValue({
      pathname: '/about',
      search: '',
      hash: '',
      state: null,
      key: 'about',
      unstable_mask: undefined,
    } as ReturnType<typeof useLocation>);

    rerender(<TraceKitRouterBreadcrumbs />);

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/ -> /about',
      data: {
        from: '/',
        to: '/about',
      },
    });
  });

  it('does not add breadcrumb on initial render', () => {
    render(<TraceKitRouterBreadcrumbs />);

    expect(addBreadcrumb).not.toHaveBeenCalled();
  });

  it('renders null', () => {
    const { container } = render(<TraceKitRouterBreadcrumbs />);

    expect(container.innerHTML).toBe('');
  });
});
