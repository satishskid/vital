import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertTriangle, FiRefreshCw, FiHome } = FiIcons;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };

    this.handleReload = this.handleReload.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReload() {
    window.location.reload();
  }

  handleGoHome() {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <motion.button
                onClick={this.handleReload}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                <span>Reload Page</span>
              </motion.button>

              <motion.button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiHome} className="w-5 h-5" />
                <span>Go Home</span>
              </motion.button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-50 rounded-lg p-4 text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-red-600 font-mono text-xs">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <p className="text-xs text-gray-500 mt-4">
              If this problem persists, please contact support at{' '}
              <a href="mailto:satish@skids.health" className="text-emerald-600 hover:underline">
                satish@skids.health
              </a>
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
