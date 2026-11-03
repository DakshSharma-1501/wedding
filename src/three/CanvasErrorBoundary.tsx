import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useExperience } from '../store/experience';

interface State {
  failed: boolean;
}

/** If WebGL throws (context creation, shader compile…), drop to the calm CSS backdrop. */
export class CanvasErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[webgl] falling back to static backdrop:', error, info.componentStack);
    useExperience.getState().disableWebGL();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}
