import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("🔥 Error Caught by Boundary:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-center px-6">
          <h1 className="text-3xl font-bold text-rose-400">
            Something went wrong
          </h1>
          <p className="text-slate-400 mt-4">
            An unexpected error occurred.
          </p>

          <button
            onClick={this.handleReload}
            className="mt-6 px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:brightness-110 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;