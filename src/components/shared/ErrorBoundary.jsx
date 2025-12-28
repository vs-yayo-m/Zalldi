// src/components/shared/ErrorBoundary.jsx

import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-800 mb-3">
              Something went wrong
            </h1>
            
            <p className="text-base text-neutral-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.errorInfo && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}