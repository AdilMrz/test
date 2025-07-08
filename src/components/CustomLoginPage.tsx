import React from "react";
import { Divider, Stack, Typography, Box, styled } from "@mui/material";
import {
  LoginForm,
  AppleButton,
  AzureButton,
  BitbucketButton,
  DiscordButton,
  FacebookButton,
  GitlabButton,
  GithubButton,
  GoogleButton,
  KeycloakButton,
  LinkedInButton,
  NotionButton,
  SlackButton,
  SpotifyButton,
  TwitchButton,
  TwitterButton,
  WorkosButton,
} from "ra-supabase";
import { CustomAuthLayout } from "./CustomAuthLayout";

// Styled components for better layout
const LoginContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
  animation: "fadeInUp 0.6s ease-out",

  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),

  "& h1": {
    background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
  },

  "& p": {
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
}));

const ProvidersSection = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  padding: theme.spacing(1, 0),

  "& button": {
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: theme.spacing(1.75, 2.5),
    transition: "all 0.2s ease-in-out",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#374151",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",

    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderColor: "#cbd5e1",
      backgroundColor: "#f8fafc",
    },

    "&:active": {
      transform: "translateY(0)",
    },

    "& .MuiButton-startIcon": {
      marginRight: theme.spacing(1.5),
    },
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  "&::before, &::after": {
    borderColor: "#e2e8f0",
    borderWidth: "1px",
  },
  "& .MuiDivider-wrapper": {
    padding: theme.spacing(0, 2),
    "& .MuiTypography-root": {
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
  },
}));

interface CustomLoginPageProps {
  children?: React.ReactNode;
  disableEmailPassword?: boolean;
  disableForgotPassword?: boolean;
  providers?: string[];
  title?: string;
  subtitle?: string;
}

/**
 * Custom login page that replicates ra-supabase LoginPage functionality
 * but uses our custom AuthLayout to avoid defaultProps warnings
 */
export const CustomLoginPage: React.FC<CustomLoginPageProps> = ({
  children,
  disableEmailPassword = false,
  disableForgotPassword = false,
  providers = [],
  title = "Welcome Back",
  subtitle = "Sign in to your account",
}) => {
  const providerButtons = providers
    .map((provider) => {
      switch (provider) {
        case "apple":
          return <AppleButton key={provider} />;
        case "azure":
          return <AzureButton key={provider} />;
        case "bitbucket":
          return <BitbucketButton key={provider} />;
        case "discord":
          return <DiscordButton key={provider} />;
        case "facebook":
          return <FacebookButton key={provider} />;
        case "gitlab":
          return <GitlabButton key={provider} />;
        case "github":
          return <GithubButton key={provider} />;
        case "google":
          return <GoogleButton key={provider} />;
        case "keycloak":
          return <KeycloakButton key={provider} />;
        case "linkedin":
          return <LinkedInButton key={provider} />;
        case "notion":
          return <NotionButton key={provider} />;
        case "slack":
          return <SlackButton key={provider} />;
        case "spotify":
          return <SpotifyButton key={provider} />;
        case "twitch":
          return <TwitchButton key={provider} />;
        case "twitter":
          return <TwitterButton key={provider} />;
        case "workos":
          return <WorkosButton key={provider} />;
        default:
          return null;
      }
    })
    .filter(Boolean);

  return (
    <CustomAuthLayout>
      {children ?? (
        <LoginContainer>
          <WelcomeSection>
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          </WelcomeSection>

          {!disableEmailPassword && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",

                "& .MuiTextField-root": {
                  marginBottom: 3,
                  width: "100%",
                  maxWidth: "400px",

                  "& .MuiInputLabel-root": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#6b7280",
                    transform: "translate(16px, 16px) scale(1)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(16px, -9px) scale(0.75)",
                      backgroundColor: "#ffffff",
                      padding: "0 8px",
                    },
                    "&.Mui-focused": {
                      color: "#14532d",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s ease-in-out",
                    fontSize: "0.875rem",
                    width: "100%",

                    "&:hover": {
                      borderColor: "#cbd5e1",
                      backgroundColor: "#ffffff",
                    },

                    "&.Mui-focused": {
                      borderColor: "#14532d",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 3px rgba(20, 83, 45, 0.1)",
                    },

                    "& fieldset": {
                      border: "none",
                    },

                    "& input": {
                      padding: "16px 16px",
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      lineHeight: "1.5",
                      width: "100%",

                      "&::placeholder": {
                        color: "#94a3b8",
                        opacity: 1,
                      },
                    },

                    // Style for password field with eye icon
                    "&.MuiInputAdornment-root": {
                      "& .MuiInputAdornment-positionEnd": {
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        "& .MuiIconButton-root": {
                          padding: "8px",
                          color: "#6b7280",
                          "&:hover": {
                            color: "#14532d",
                            backgroundColor: "rgba(20, 83, 45, 0.04)",
                          },
                        },
                      },
                    },

                    // Ensure password input has proper padding for the icon
                    "&:has(.MuiInputAdornment-positionEnd) input": {
                      paddingRight: "48px",
                    },
                  },
                },
                "& .MuiButton-root": {
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "14px 24px",
                  marginTop: 2,
                  width: "100%",
                  maxWidth: "400px",
                  alignSelf: "center",
                  background:
                    "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
                  color: "#ffffff",
                  boxShadow: "none",
                  transition: "all 0.2s ease-in-out",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
                    boxShadow: "0 4px 12px rgba(20, 83, 45, 0.4)",
                    transform: "translateY(-1px)",
                  },

                  "&:active": {
                    transform: "translateY(0)",
                  },
                },
                "& .MuiLink-root": {
                  color: "#14532d",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "color 0.2s ease-in-out",
                  display: "block",
                  textAlign: "center",
                  marginTop: "8px",

                  "&:hover": {
                    color: "#0f172a",
                    textDecoration: "underline",
                  },
                },
              }}
            >
              <LoginForm disableForgotPassword={disableForgotPassword} />
            </Box>
          )}

          {!disableEmailPassword && providers.length > 0 && (
            <StyledDivider>
              <Typography variant="body2" color="text.secondary">
                or continue with
              </Typography>
            </StyledDivider>
          )}

          {providers.length > 0 && (
            <ProvidersSection>{providerButtons}</ProvidersSection>
          )}
        </LoginContainer>
      )}
    </CustomAuthLayout>
  );
};

export default CustomLoginPage;
