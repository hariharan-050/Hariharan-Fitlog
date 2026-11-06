import React, { Component } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isNetworkError: false,
    };
  }

  static getDerivedStateFromError(error) {
    const isNetworkError =
      error?.isAxiosError ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('Server Unreachable');
    return {
      hasError: true,
      error,
      isNetworkError,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isNetworkError: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unknown runtime fault';

      return (
        <div className="error-boundary-screen" role="alert">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              <AlertOctagon size={48} className="text-danger" />
            </div>
            <h2 className="error-boundary-title">Unexpected Rendering Exception</h2>
            <p className="error-boundary-message">{errorMessage}</p>
            {this.state.isNetworkError && (
              <div className="network-error-banner">Server Unreachable</div>
            )}
            <div className="error-boundary-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleReset}
              >
                <RefreshCw size={16} className="btn-icon" />
                Reload Component
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorHandler;
