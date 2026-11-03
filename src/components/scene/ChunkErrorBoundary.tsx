import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  failed: boolean;
}

/**
 * If a lazily loaded chunk fails (flaky mobile data), keep the rest of the invitation
 * alive and offer a gentle retry instead of a blank page.
 */
export class ChunkErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[scenes] failed to load:', error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
        <p className="max-w-sm font-display text-2xl text-peacock italic">
          The rest of the invitation didn’t finish loading.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-gold gold-shimmer mt-6"
        >
          Try again
        </button>
      </section>
    );
  }
}
