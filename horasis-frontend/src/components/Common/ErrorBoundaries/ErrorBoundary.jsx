// ErrorBoundary.jsx
import React, { Component } from 'react';

// This inner class component does the actual error boundary work.
class InnerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so that the fallback UI is shown.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error if needed.
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI provided via props.
      const { FallbackComponent } = this.props;
      return <FallbackComponent error={this.state.error} />;
    }
    return this.props.children;
  }
}

// The functional component wraps the inner error boundary.
const ErrorBoundary = ({ children, FallbackComponent }) => {
  return (
    <InnerErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </InnerErrorBoundary>
  );
};

export default ErrorBoundary;
