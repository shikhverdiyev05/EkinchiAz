/* eslint-disable no-unused-vars */
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(_error, _errorInfo) {
    // Silently catch errors
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
