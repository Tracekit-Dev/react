# @tracekit/react

TraceKit React SDK -- ErrorBoundary, React 19 error hooks, and React Router breadcrumbs for production error tracking.

## Installation

```bash
npm install @tracekit/react @tracekit/browser
```

## Quick Start

```jsx
import { init } from '@tracekit/browser';
import { TraceKitErrorBoundary } from '@tracekit/react';

init({ dsn: 'https://your-dsn@tracekit.dev/1' });

function App() {
  return (
    <TraceKitErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApp />
    </TraceKitErrorBoundary>
  );
}
```

### React Router Breadcrumbs

```jsx
import { TraceKitRouterBreadcrumbs } from '@tracekit/react';

function App() {
  return (
    <BrowserRouter>
      <TraceKitRouterBreadcrumbs />
      <Routes>{/* your routes */}</Routes>
    </BrowserRouter>
  );
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showDialog` | `boolean` | `false` | Show a user feedback dialog on error |
| `fallback` | `ReactNode` | `null` | Fallback UI to render when an error is caught |
| `onError` | `(error, componentStack) => void` | `undefined` | Callback invoked on each caught error |

## Documentation

Full documentation: [https://app.tracekit.dev/docs/frontend/frameworks](https://app.tracekit.dev/docs/frontend/frameworks)

## License

MIT
