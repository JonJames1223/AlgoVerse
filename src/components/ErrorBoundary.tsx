import { Component, type ErrorInfo, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AlgoVerse rendering error', error, info.componentStack);
  }
  render() {
    if (this.state.failed)
      return (
        <main className="error-screen">
          <p className="eyebrow">WORKSPACE INTERRUPTED</p>
          <h1>Let’s try that again.</h1>
          <p>
            Something unexpected happened while rendering this lab. Reload to start a fresh
            visualization.
          </p>
          <button className="button primary" onClick={() => window.location.reload()}>
            Reload workspace
          </button>
        </main>
      );
    return this.props.children;
  }
}
