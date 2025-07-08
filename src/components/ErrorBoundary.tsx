import React, { Component, ReactNode } from "react";
import {
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
} from "./ui";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { AppError, ErrorBoundaryState } from "../types/errors";
import {
  normalizeError,
  generateErrorId,
  getUserFriendlyMessage,
} from "../utils/errorUtils";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, errorId: string, retry: () => void) => ReactNode;
  onError?: (error: AppError, errorId: string) => void;
  enableRetry?: boolean;
  showDetails?: boolean;
}

interface ErrorBoundaryComponentState extends ErrorBoundaryState {
  showDetails: boolean;
  retryCount: number;
}

/**
 * Global Error Boundary Component
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryComponentState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorId: undefined,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryComponentState> {
    const appError = normalizeError(error);
    const errorId = generateErrorId();

    return {
      hasError: true,
      error: appError,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = normalizeError(error);
    const errorId = this.state.errorId || generateErrorId();

    // Enhanced error with React error info
    appError.details = {
      ...appError.details,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    };

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(appError, errorId);
    }

    // Log to console
    console.error("Error Boundary caught an error:", {
      error: appError,
      errorId,
      errorInfo,
    });
  }

  handleRetry = () => {
    const maxRetries = 3;

    if (this.state.retryCount >= maxRetries) {
      console.warn("Maximum retry attempts reached");
      return;
    }

    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorId: undefined,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
    }));

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Reset retry count after 5 minutes
    this.retryTimeoutId = setTimeout(
      () => {
        this.setState({ retryCount: 0 });
      },
      5 * 60 * 1000,
    );
  };

  handleToggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error && this.state.errorId) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorId,
          this.handleRetry,
        );
      }

      // Default error UI
      return (
        <div className="flex justify-center items-center min-h-[50vh] p-6">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
                <h1 className="text-2xl font-bold text-red-600">
                  Something went wrong
                </h1>
              </div>

              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {getUserFriendlyMessage(this.state.error)}
              </p>

              <Alert variant="info" className="mb-6">
                <AlertTitle>Error Information</AlertTitle>
                <AlertDescription>
                  Error ID:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {this.state.errorId}
                  </code>
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-4 mb-6">
                {this.props.enableRetry !== false && (
                  <Button
                    variant="default"
                    onClick={this.handleRetry}
                    disabled={this.state.retryCount >= 3}
                    className="flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>
                      {this.state.retryCount >= 3
                        ? "Max retries reached"
                        : "Try Again"}
                    </span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>

              {this.props.showDetails !== false && (
                <>
                  <button
                    onClick={this.handleToggleDetails}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
                  >
                    {this.state.showDetails ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {this.state.showDetails ? "Hide" : "Show"} technical
                      details
                    </span>
                  </button>

                  {this.state.showDetails && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Technical Details
                      </h4>
                      <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(
                          {
                            message: this.state.error.message,
                            code: this.state.error.code,
                            status: this.state.error.status,
                            timestamp: this.state.error.timestamp,
                            stack: this.state.error.stack
                              ?.split("\n")
                              .slice(0, 5)
                              .join("\n"),
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  )}
                </>
              )}

              {this.state.retryCount > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Retry attempts: {this.state.retryCount}/3
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
