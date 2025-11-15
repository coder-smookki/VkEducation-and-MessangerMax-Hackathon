import { Component,type  ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <h1 className="text-red-500 font-bold mb-2">Ошибка в рендере</h1>
          <pre className="text-xs whitespace-pre-wrap break-all bg-black/20 p-3 rounded">
            {String(this.state.error ?? 'unknown')}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
