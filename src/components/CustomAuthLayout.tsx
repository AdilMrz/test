import React from "react";
import { Card, Avatar, styled, ThemeProvider, Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";

// Enhanced theme with project colors
const defaultTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#14532d",
      light: "#16a34a",
      dark: "#0f172a",
    },
    secondary: {
      main: "#eef2ea",
      light: "#f7f9f5",
      dark: "#d1d5db",
    },
    background: {
      default: "#f0f1f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#14532d",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.2,
      color: "#1e293b",
      marginBottom: "0.5rem",
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease-in-out",
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
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            fontSize: "0.875rem",
            fontWeight: 500,
            "&.Mui-focused": {
              color: "#14532d",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          borderRadius: 12,
          padding: "12px 24px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
          color: "#ffffff",
          "&:hover": {
            background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
            boxShadow: "0 4px 12px rgba(20, 83, 45, 0.4)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
  },
});

// Default notification component (empty for now)
const DefaultNotification = () => null;

interface CustomAuthLayoutProps {
  children?: React.ReactNode;
  className?: string;
  theme?: Theme;
  notification?: React.ComponentType;
  backgroundImage?: string;
  [key: string]: unknown;
}

const PREFIX = "RaAuthLayout";

const AuthLayoutClasses = {
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
  icon: `${PREFIX}-icon`,
};

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
  position: "relative",
  overflow: "hidden",

  // Animated background elements
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `
      radial-gradient(circle at 20% 80%, rgba(20, 83, 45, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(22, 163, 74, 0.2) 0%, transparent 50%)
    `,
    animation: "float 20s ease-in-out infinite",
    zIndex: 0,
  },

  "@keyframes float": {
    "0%, 100%": {
      transform: "translate(0px, 0px) rotate(0deg)",
    },
    "33%": {
      transform: "translate(30px, -30px) rotate(120deg)",
    },
    "66%": {
      transform: "translate(-20px, 20px) rotate(240deg)",
    },
  },

  [`& .${AuthLayoutClasses.card}`]: {
    minWidth: 420,
    maxWidth: 480,
    width: "100%",
    padding: theme.spacing(4),
    borderRadius: 24,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
    position: "relative",
    zIndex: 1,
    transition: "all 0.3s ease-in-out",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `
        0 32px 64px -12px rgba(0, 0, 0, 0.35),
        0 0 0 1px rgba(255, 255, 255, 0.2)
      `,
    },

    [theme.breakpoints.down("sm")]: {
      minWidth: "unset",
      maxWidth: "90vw",
      margin: theme.spacing(2),
      padding: theme.spacing(3),
      borderRadius: 20,
    },
  },

  [`& .${AuthLayoutClasses.avatar}`]: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
  },

  [`& .${AuthLayoutClasses.icon}`]: {
    background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
    width: 64,
    height: 64,
    boxShadow: "0 8px 32px rgba(20, 83, 45, 0.4)",
    border: "2px solid rgba(255, 255, 255, 0.2)",

    "& svg": {
      fontSize: "1.75rem",
      color: "#ffffff",
    },
  },
}));

/**
 * Custom AuthLayout component that uses JavaScript default parameters
 * instead of defaultProps to avoid React 18+ warnings
 */
export const CustomAuthLayout: React.FC<CustomAuthLayoutProps> = ({
  children,
  className,
  theme = defaultTheme,
  notification = DefaultNotification,
  backgroundImage,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const NotificationComponent = notification;

  return (
    <ThemeProvider theme={theme}>
      <Root
        {...rest}
        ref={containerRef}
        className={className}
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : undefined
        }
      >
        <Card className={AuthLayoutClasses.card}>
          <div className={AuthLayoutClasses.avatar}>
            <Avatar className={AuthLayoutClasses.icon}>
              <LockIcon />
            </Avatar>
          </div>
          {children}
        </Card>
        {NotificationComponent && <NotificationComponent />}
      </Root>
    </ThemeProvider>
  );
};

export default CustomAuthLayout;
