import React, { Component, ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BugReport as BugReportIcon,
} from "@mui/icons-material";
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
          p={3}
        >
          <Card sx={{ maxWidth: 600, width: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BugReportIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h5" color="error">
                  Something went wrong
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" mb={3}>
                {getUserFriendlyMessage(this.state.error)}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                Error ID: {this.state.errorId}
              </Alert>

              <Box display="flex" gap={2} mb={2}>
                {this.props.enableRetry !== false && (
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={this.handleRetry}
                    disabled={this.state.retryCount >= 3}
                  >
                    {this.state.retryCount >= 3
                      ? "Max retries reached"
                      : "Try Again"}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </Box>

              {this.props.showDetails !== false && (
                <>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={this.handleToggleDetails} size="small">
                      {this.state.showDetails ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {this.state.showDetails ? "Hide" : "Show"} technical
                      details
                    </Typography>
                  </Box>

                  <Collapse in={this.state.showDetails}>
                    <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                        }}
                      >
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
                      </Typography>
                    </Box>
                  </Collapse>
                </>
              )}

              {this.state.retryCount > 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  mt={2}
                  display="block"
                >
                  Retry attempts: {this.state.retryCount}/3
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
