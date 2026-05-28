import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-natu-ivory flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-2xl text-natu-brown">Algo deu errado ao carregar esta página.</p>
          <p className="text-sm text-natu-brown/60">Tente recarregar ou volte à página inicial.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="natu-button mt-2"
          >
            Voltar ao início
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
