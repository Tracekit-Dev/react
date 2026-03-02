import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { addBreadcrumb } from '@tracekit/browser';
import type { RouterBreadcrumbsProps } from './types';

/**
 * TraceKitRouterBreadcrumbs
 *
 * Invisible component that records React Router navigation changes as
 * breadcrumbs via the TraceKit SDK. Place inside your Router component.
 *
 * Requires `react-router` >= 6.0.0 to be installed.
 *
 * Usage:
 *   <BrowserRouter>
 *     <TraceKitRouterBreadcrumbs />
 *     <Routes>...</Routes>
 *   </BrowserRouter>
 */
export function TraceKitRouterBreadcrumbs({
  parameterizedRoutes: _parameterizedRoutes = true,
}: RouterBreadcrumbsProps = {}): null {
  const location = useLocation();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    if (prevPathnameRef.current !== null && prevPathnameRef.current !== currentPath) {
      addBreadcrumb({
        category: 'navigation',
        message: `${prevPathnameRef.current} -> ${currentPath}`,
        data: {
          from: prevPathnameRef.current,
          to: currentPath,
        },
      });
    }

    prevPathnameRef.current = currentPath;
  }, [location]);

  return null;
}
